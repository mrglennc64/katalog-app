import type { NextAuthConfig } from "next-auth";

export default {
  providers: [],
  trustHost: true,
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
