import { NextResponse } from "next/server";
import { getSession, AUTH_COOKIE } from "@/lib/auth-store";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]+)`));
  const session = m ? getSession(decodeURIComponent(m[1])) : null;
  if (!session) return NextResponse.json({ authenticated: false });
  return NextResponse.json({
    authenticated: true,
    email: session.email,
    publisher_id: session.publisher_id,
    expires: session.expires,
  });
}
