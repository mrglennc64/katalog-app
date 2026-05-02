import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";

const APP_BASE_PATH = process.env.KATALOGHUB_BASEPATH || "";
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = `${APP_BASE_PATH}/login`;
    url.search = "";
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ["/kataloghub/:path*"],
};
