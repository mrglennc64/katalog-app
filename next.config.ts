import type { NextConfig } from "next";

const basePath = process.env.KATALOGHUB_BASEPATH || "";

const nextConfig: NextConfig = {
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
