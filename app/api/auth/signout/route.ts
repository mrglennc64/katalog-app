import { NextResponse } from "next/server";
import { destroySession, AUTH_COOKIE } from "@/lib/auth-store";

const APP_BASE_PATH = process.env.KATALOGHUB_BASEPATH || "";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]+)`));
  if (m) destroySession(decodeURIComponent(m[1]));

  const res = NextResponse.redirect(new URL(`${APP_BASE_PATH}/login`, url.origin));
  res.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
