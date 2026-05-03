import { NextResponse } from "next/server";
import { consumeMagicToken, createSession, AUTH_COOKIE } from "@/lib/auth-store";
import { publicOrigin } from "@/lib/auth-origin";

const APP_BASE_PATH = process.env.KATALOGHUB_BASEPATH || "";

export async function GET(req: Request) {
  const origin = publicOrigin(req);
  const token = new URL(req.url).searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(`${origin}${APP_BASE_PATH}/login?err=missing_token`);
  }

  const consumed = consumeMagicToken(token);
  if (!consumed) {
    return NextResponse.redirect(`${origin}${APP_BASE_PATH}/login?err=invalid_token`);
  }

  const sessionToken = createSession(consumed.publisher_id, consumed.email);
  const res = NextResponse.redirect(`${origin}${APP_BASE_PATH}/kataloghub`);
  res.cookies.set(AUTH_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: origin.startsWith("https://"),
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  return res;
}
