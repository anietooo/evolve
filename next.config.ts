import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  trailingSlash: true,
  basePath: process.env.NODE_ENV === "production" ? "/evolve" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
