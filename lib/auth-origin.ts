/**
 * Returns the public origin (scheme + host) for the current request,
 * preferring proxy headers over the internal listener URL.
 *
 * Inside a reverse-proxied Next.js process, `new URL(req.url).origin`
 * returns `http://localhost:3002` (the listener), which is wrong for
 * generating user-facing URLs. nginx sets Host + X-Forwarded-Proto, which
 * is what we want.
 */
export function publicOrigin(req: Request): string {
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host =
    req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}
