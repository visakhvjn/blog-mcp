import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  async rewrites() {
    return [
      {
        source: "/openapi.yaml",
        destination: "/api/openapi",
      },
    ];
  },
};

export default nextConfig;
