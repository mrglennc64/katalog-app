import { NextResponse } from "next/server";
import { consumeMagicToken, createSession, AUTH_COOKIE } from "@/lib/auth-store";

const APP_BASE_PATH = process.env.KATALOGHUB_BASEPATH || "";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL(`${APP_BASE_PATH}/login?err=missing_token`, url.origin));
  }

  const consumed = consumeMagicToken(token);
  if (!consumed) {
    return NextResponse.redirect(new URL(`${APP_BASE_PATH}/login?err=invalid_token`, url.origin));
  }

  const sessionToken = createSession(consumed.publisher_id, consumed.email);
  const dest = new URL(`${APP_BASE_PATH}/kataloghub`, url.origin);
  const res = NextResponse.redirect(dest);
  res.cookies.set(AUTH_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: url.protocol === "https:",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  return res;
}
