import { NextResponse } from "next/server";
import { destroySession, AUTH_COOKIE } from "@/lib/auth-store";
import { publicOrigin } from "@/lib/auth-origin";

const APP_BASE_PATH = process.env.KATALOGHUB_BASEPATH || "";

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]+)`));
  if (m) destroySession(decodeURIComponent(m[1]));

  const res = NextResponse.redirect(`${publicOrigin(req)}${APP_BASE_PATH}/login`);
  res.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
