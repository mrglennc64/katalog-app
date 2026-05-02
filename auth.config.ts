import type { NextAuthConfig } from "next-auth";

const APP_BASE_PATH = process.env.KATALOGHUB_BASEPATH || "";

export default {
  providers: [],
  trustHost: true,
  basePath: `${APP_BASE_PATH}/api/auth`,
  pages: {
    signIn: `${APP_BASE_PATH}/login`,
    verifyRequest: `${APP_BASE_PATH}/login/check-email`,
  },
} satisfies NextAuthConfig;
