import type { NextAuthConfig } from "next-auth";

const APP_BASE_PATH = process.env.KATALOGHUB_BASEPATH || "";

export default {
  providers: [],
  basePath: `${APP_BASE_PATH}/api/auth`,
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
  },
  callbacks: {
    authorized({ request, auth }) {
      const isProtected = request.nextUrl.pathname.startsWith("/kataloghub");
      if (isProtected && !auth) return false;
      return true;
    },
  },
} satisfies NextAuthConfig;
