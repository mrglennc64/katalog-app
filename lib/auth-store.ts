import fs from "node:fs";
import path from "node:path";
import { randomBytes, randomUUID } from "node:crypto";

/**
 * File-backed user/token/session store.
 *
 * Files live under $KATALOGHUB_DATA_DIR (default `./data`):
 *   - users.json      — publishers + approved users
 *   - tokens.json     — one-time magic-link tokens (15 min TTL)
 *   - sessions.json   — active session tokens (30 day TTL)
 *
 * Single-instance PM2 deployment: file writes are best-effort atomic via
 * write-to-tmp + rename. No locking — fine for low traffic.
 */

export type Publisher = {
  publisher_id: string;
  org_number: string;
  company: string;
};

export type AuthUser = {
  publisher_id: string;
  email: string;
  status: "approved" | "pending";
  created_at?: string;
};

export type UsersFile = {
  publishers: Publisher[];
  users: AuthUser[];
};

export type MagicToken = {
  token: string;
  email: string;
  publisher_id: string;
  expires: string;
};

export type Session = {
  session_token: string;
  email: string;
  publisher_id: string;
  expires: string;
};

const DATA_DIR = process.env.KATALOGHUB_DATA_DIR || path.join(process.cwd(), "data");
const USERS_PATH = path.join(DATA_DIR, "users.json");
const TOKENS_PATH = path.join(DATA_DIR, "tokens.json");
const SESSIONS_PATH = path.join(DATA_DIR, "sessions.json");

const TOKEN_TTL_MS = 15 * 60 * 1000;       // 15 min
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson<T>(file: string, fallback: T): T {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, data: unknown) {
  ensureDir();
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmp, file);
}

function normEmail(s: string): string {
  return s.trim().toLowerCase();
}

function normOrg(s: string): string {
  return s.replace(/\s|-/g, "");
}

// ---------------- users ----------------

export function loadUsers(): UsersFile {
  return readJson<UsersFile>(USERS_PATH, { publishers: [], users: [] });
}

export function saveUsers(data: UsersFile) {
  writeJson(USERS_PATH, data);
}

export function findPublisherByOrg(orgNumber: string): Publisher | null {
  const target = normOrg(orgNumber);
  const { publishers } = loadUsers();
  return publishers.find((p) => normOrg(p.org_number) === target) ?? null;
}

export function findApprovedUser(publisherId: string, email: string): AuthUser | null {
  const { users } = loadUsers();
  const target = normEmail(email);
  return (
    users.find(
      (u) => u.publisher_id === publisherId && normEmail(u.email) === target && u.status === "approved",
    ) ?? null
  );
}

export function addPendingUser(input: {
  org_number: string;
  company: string;
  email: string;
}): { publisher_id: string } {
  const data = loadUsers();
  const orgNorm = normOrg(input.org_number);
  let publisher = data.publishers.find((p) => normOrg(p.org_number) === orgNorm);
  if (!publisher) {
    publisher = {
      publisher_id: "P-" + randomBytes(3).toString("hex").toUpperCase(),
      org_number: input.org_number,
      company: input.company,
    };
    data.publishers.push(publisher);
  }
  const emailNorm = normEmail(input.email);
  const exists = data.users.some(
    (u) => u.publisher_id === publisher!.publisher_id && normEmail(u.email) === emailNorm,
  );
  if (!exists) {
    data.users.push({
      publisher_id: publisher.publisher_id,
      email: input.email,
      status: "pending",
      created_at: new Date().toISOString(),
    });
  }
  saveUsers(data);
  return { publisher_id: publisher.publisher_id };
}

// ---------------- magic tokens ----------------

export function createMagicToken(publisherId: string, email: string): string {
  const token = randomBytes(32).toString("hex");
  const tokens = readJson<{ tokens: MagicToken[] }>(TOKENS_PATH, { tokens: [] });
  tokens.tokens = tokens.tokens.filter(
    (t) => new Date(t.expires).getTime() > Date.now(),
  );
  tokens.tokens.push({
    token,
    email,
    publisher_id: publisherId,
    expires: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
  });
  writeJson(TOKENS_PATH, tokens);
  return token;
}

export function consumeMagicToken(token: string): { email: string; publisher_id: string } | null {
  const tokens = readJson<{ tokens: MagicToken[] }>(TOKENS_PATH, { tokens: [] });
  const idx = tokens.tokens.findIndex((t) => t.token === token);
  if (idx < 0) return null;
  const entry = tokens.tokens[idx];
  if (new Date(entry.expires).getTime() < Date.now()) {
    tokens.tokens.splice(idx, 1);
    writeJson(TOKENS_PATH, tokens);
    return null;
  }
  tokens.tokens.splice(idx, 1);
  writeJson(TOKENS_PATH, tokens);
  return { email: entry.email, publisher_id: entry.publisher_id };
}

// ---------------- sessions ----------------

export function createSession(publisherId: string, email: string): string {
  const sessions = readJson<{ sessions: Session[] }>(SESSIONS_PATH, { sessions: [] });
  sessions.sessions = sessions.sessions.filter(
    (s) => new Date(s.expires).getTime() > Date.now(),
  );
  const sessionToken = randomUUID() + "." + randomBytes(16).toString("hex");
  sessions.sessions.push({
    session_token: sessionToken,
    email,
    publisher_id: publisherId,
    expires: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  });
  writeJson(SESSIONS_PATH, sessions);
  return sessionToken;
}

export function getSession(sessionToken: string | undefined | null): Session | null {
  if (!sessionToken) return null;
  const { sessions } = readJson<{ sessions: Session[] }>(SESSIONS_PATH, { sessions: [] });
  const s = sessions.find((x) => x.session_token === sessionToken);
  if (!s) return null;
  if (new Date(s.expires).getTime() < Date.now()) return null;
  return s;
}

export function destroySession(sessionToken: string): void {
  const data = readJson<{ sessions: Session[] }>(SESSIONS_PATH, { sessions: [] });
  data.sessions = data.sessions.filter((s) => s.session_token !== sessionToken);
  writeJson(SESSIONS_PATH, data);
}

export const AUTH_COOKIE = "kh_session";
