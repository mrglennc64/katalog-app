# Kataloghub — Deployment Runbook

Live at **http://kataloghub.se/app/kataloghub** (HTTP only, no TLS yet on `kataloghub.se`).

Auth: NextAuth v5 magic-link via Resend. No basic-auth gate.

---

## Stack

| Layer | What | Version | Where |
|---|---|---|---|
| VPS | Ubuntu, IP `187.77.111.16` (SSH alias `srv2`) | — | — |
| Web server | nginx | 1.24.0 | `/etc/nginx/sites-available/kataloghub.se` |
| App framework | Next.js (App Router, Turbopack) | 16.2.4 | `/srv/kataloghub/app` |
| Process manager | PM2 | 6.0.14 | ecosystem at `/srv/kataloghub/app/ecosystem.config.cjs` |
| Auth | Auth.js (NextAuth v5 beta) | — | `lib/auth.ts`, `auth.config.ts`, `middleware.ts`, `app/api/auth/[...nextauth]/route.ts` |
| ORM | Prisma | 6.x (pinned — v7 requires `prisma.config.ts`) | `prisma/schema.prisma` |
| DB | SQLite | — | `/srv/kataloghub/data/auth.db` |
| Email | Resend (SMTP relay via Nodemailer) | — | env `EMAIL_SERVER` |
| Repo | `mrglennc64/katalog-app` (`main`) | — | github |

The kataloghub.se root (`/`) continues to be proxied to a separate FastAPI uvicorn on `:8000` that serves the legacy static landing/marketing pages. Don't touch.

---

## Layout on srv2

```
/srv/kataloghub/
├── app/                     # cloned repo, build artifacts, ecosystem
│   ├── .next/               # build output
│   ├── ecosystem.config.cjs # PM2 config — loads env from /srv/kataloghub/env/
│   ├── prisma/schema.prisma
│   └── ...
├── data/
│   └── auth.db              # SQLite (NextAuth users/sessions/tokens)
├── env/
│   └── kataloghub.env       # all runtime env vars (see below)
└── logs/
    ├── err.log
    └── out.log
```

PM2 process: `kataloghub`, listens on **port 3002** (3000 is taken by `trapcrm`).

nginx routes `kataloghub.se/app/*` → `127.0.0.1:3002` (no auth_basic anymore).

---

## Env vars (`/srv/kataloghub/env/kataloghub.env`)

```
KATALOGHUB_BASEPATH=/app
NODE_ENV=production
PORT=3002
NEXT_PUBLIC_HEYROYA_URL=https://heyroya.se/queue
DATABASE_URL=file:/srv/kataloghub/data/auth.db
NEXTAUTH_URL=http://kataloghub.se
NEXTAUTH_SECRET=<generated with `openssl rand -base64 32`>
EMAIL_SERVER=smtps://resend:<RESEND_API_KEY>@smtp.resend.com:465
EMAIL_FROM="Kataloghub <onboarding@resend.dev>"
```

Notes:
- `KATALOGHUB_BASEPATH` must also be set at **build time** (`KATALOGHUB_BASEPATH=/app npm run build`) — it's inlined as `NEXT_PUBLIC_BASE_PATH` into the client bundle for `lib/api.ts`.
- `NEXTAUTH_URL` is the **origin only** (no `/app`). NextAuth's `basePath` option in `auth.config.ts` adds `${KATALOGHUB_BASEPATH}/api/auth`.
- `EMAIL_FROM` — Resend free tier only delivers from `onboarding@resend.dev` until you verify a custom domain in their dashboard. Once verified, switch to e.g. `Kataloghub <no-reply@kataloghub.se>`.
- Resend free tier also only delivers TO the email address registered with the API key (test mode). Verify the domain to send to anyone.

---

## Deploy a code change

From your laptop:
```bash
git push origin main
```

Then on srv2:
```bash
ssh srv2 "set -e
cd /srv/kataloghub/app
git pull --ff-only origin main
set -a; . /srv/kataloghub/env/kataloghub.env; set +a
npm ci                                       # only if package-lock changed
npx prisma generate                          # only if schema.prisma changed
npx prisma db push --skip-generate           # only if schema.prisma changed
KATALOGHUB_BASEPATH=/app NODE_ENV=production npm run build
pm2 reload kataloghub --update-env
"
```

The `set -a; . env; set +a` pattern exports the env file into the shell so `npm run build` and Prisma commands see `DATABASE_URL` etc.

`pm2 reload --update-env` is required when env values change (PM2 caches them otherwise).

---

## Common operations

```bash
# tail logs
ssh srv2 "pm2 logs kataloghub --lines 50 --nostream"

# restart (zero-downtime reload)
ssh srv2 "pm2 reload kataloghub --update-env"

# hard restart (full process kill + restart)
ssh srv2 "pm2 restart kataloghub --update-env"

# status
ssh srv2 "pm2 status"

# inspect users in SQLite
ssh srv2 "sqlite3 /srv/kataloghub/data/auth.db 'SELECT id, email, emailVerified FROM User;'"

# list verification tokens (debugging magic-link)
ssh srv2 "sqlite3 /srv/kataloghub/data/auth.db 'SELECT identifier, expires FROM VerificationToken;'"

# reload nginx after editing /etc/nginx/sites-available/kataloghub.se
ssh srv2 "nginx -t && systemctl reload nginx"
```

---

## NextAuth + basePath (the awkward part)

Next.js with `basePath: "/app"` strips `/app` from incoming requests **before** the `/api/auth/[...nextauth]/route.ts` handler runs. NextAuth's URL parser then can't find the action because it expects the basePath in `request.url.pathname`.

Workaround: `app/api/auth/[...nextauth]/route.ts` re-prepends `/app` to the request URL before calling `handlers.GET/POST`. See `withBasePath()` there. This goes away when we drop basePath (subdomain migration).

Middleware uses `auth.config.ts` (no Prisma adapter) so it can run on the Edge runtime. Full config with Prisma is in `lib/auth.ts` for API/server-component use.

---

## Add HTTPS to kataloghub.se

```bash
ssh srv2 "certbot --nginx -d kataloghub.se -d www.kataloghub.se"
# certbot rewrites /etc/nginx/sites-available/kataloghub.se to add :443 + redirects
ssh srv2 "nginx -t && systemctl reload nginx"
```

After cert is in:
- Update env: `NEXTAUTH_URL=https://kataloghub.se`
- Rebuild + reload (env-only change, no schema change).

---

## Migrate to `app.kataloghub.se` (drop `/app`)

Required from user: A-record `app.kataloghub.se` → `187.77.111.16`.

Then on srv2:
```bash
# 1. Cert
ssh srv2 "certbot --nginx -d app.kataloghub.se"

# 2. New nginx vhost (file: /etc/nginx/sites-available/app.kataloghub.se)
#    server_name app.kataloghub.se; location / { proxy_pass http://127.0.0.1:3002; ... }
#    Symlink into sites-enabled, nginx -t, reload.

# 3. Env updates
#    KATALOGHUB_BASEPATH= (empty)
#    NEXTAUTH_URL=https://app.kataloghub.se

# 4. Rebuild & reload
ssh srv2 "cd /srv/kataloghub/app && \
  set -a; . /srv/kataloghub/env/kataloghub.env; set +a; \
  KATALOGHUB_BASEPATH= NODE_ENV=production npm run build && \
  pm2 reload kataloghub --update-env"

# 5. Drop /app/ block from /etc/nginx/sites-available/kataloghub.se, reload nginx.

# 6. Optional cleanup: remove withBasePath() wrapper from
#    app/api/auth/[...nextauth]/route.ts (can re-export handlers directly).
```

Existing NextAuth sessions are bound to host `kataloghub.se` via the cookie domain — users will need to log in again on the new origin. Acceptable for current scale.

---

## Rollback

If a deploy breaks:
```bash
ssh srv2 "cd /srv/kataloghub/app && \
  git log --oneline -5 && \
  git reset --hard <PREVIOUS_SHA> && \
  set -a; . /srv/kataloghub/env/kataloghub.env; set +a; \
  KATALOGHUB_BASEPATH=/app NODE_ENV=production npm run build && \
  pm2 reload kataloghub --update-env"
```

For a borked nginx config, the original is backed up at `/etc/nginx/sites-available/kataloghub.se.bak.<timestamp>`.

---

## Known caveats

- **Cluster mode**: PM2 auto-detects `cluster` mode for the Next.js script. We run `instances: 1` so it's effectively fork mode behavior. Don't bump instances — Prisma + SQLite + multi-worker is a lock-conflict trap.
- **`document.write` deprecation**: the upload page's PDF popup uses `w.document.write(html)` to render the report. TS hints about deprecation. Intentional — needed for a popup-window, print-on-load workflow.
- **Resend test mode**: free tier is restricted (verified-domain + recipient-account-only). Verify `kataloghub.se` in Resend's DNS panel to send freely.
- **Mock fallback**: most `/api/kataloghub/*` routes return mock data when FastAPI on `:8000` is unreachable. Set `KATALOGHUB_REQUIRE_BACKEND=true` in env to make 502 the response instead.
