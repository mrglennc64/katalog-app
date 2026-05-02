import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.KATALOGHUB_BASEPATH || "",
};

export default nextConfig;
