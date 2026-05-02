# static-site/

Mirror of the public marketing/landing site served at **kataloghub.se** root.

**Canonical source**: separate [`mrglennc64/katolog`](https://github.com/mrglennc64/katolog) repo.
This folder is a mirror committed alongside the Next.js workspace for backup and
single-checkout convenience — it is **not** the deploy source.

## Where it lives in production

Served by FastAPI's `whitelabel` static handler at:
```
/opt/heyroya-automation/whitelabel/pages/
```

…which is reverse-proxied by nginx for `kataloghub.se/`. The Next.js workspace
in the repo root is mounted at `kataloghub.se/app/`.

## Editing

If you edit a page (e.g. `pages/index.html`):
1. Make the same change in the canonical [`katolog`](https://github.com/mrglennc64/katolog) repo and push there.
2. SCP the file to the VPS:
   ```
   scp pages/index.html srv2:/opt/heyroya-automation/whitelabel/pages/index.html
   ```
3. Clear the FastAPI render cache:
   ```
   ssh srv2 "systemctl restart heyroya-api"
   ```

The full README from the canonical repo (with deploy/branding details) is
preserved at `pages/` files and `brand.config.json`.
