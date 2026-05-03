import { NextResponse, type NextRequest } from "next/server";

const APP_BASE_PATH = process.env.KATALOGHUB_BASEPATH || "";
const AUTH_COOKIE = "kh_session";

/**
 * Edge-runtime middleware: only checks for the presence of a session cookie.
 * Cookie validity is enforced server-side in API routes / server components
 * via lib/auth-store.getSession(). Edge can't read filesystem, so we trust
 * the cookie's existence as a fast-path gate; an expired/forged cookie will
 * still be rejected by the actual session lookup downstream.
 */
export default function middleware(req: NextRequest) {
  const session = req.cookies.get(AUTH_COOKIE)?.value;
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = `${APP_BASE_PATH}/login`;
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/kataloghub/:path*"],
};
