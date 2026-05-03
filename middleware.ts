import { NextResponse, type NextRequest } from "next/server";

const APP_BASE_PATH = process.env.KATALOGHUB_BASEPATH || "";
const AUTH_COOKIE = "kh_session";

/**
 * Edge-runtime middleware: cookie presence check only. Cookie validity is
 * enforced server-side in API routes / server components.
 *
 * URL handling: req.nextUrl.pathname already INCLUDES the Next.js basePath
 * in this Next version, and assigning to pathname does not auto-prepend.
 * We construct the redirect URL explicitly from origin + APP_BASE_PATH.
 */
export default function middleware(req: NextRequest) {
  const session = req.cookies.get(AUTH_COOKIE)?.value;
  if (!session) {
    const target = `${req.nextUrl.origin}${APP_BASE_PATH}/login`;
    return NextResponse.redirect(target);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/kataloghub/:path*"],
};
