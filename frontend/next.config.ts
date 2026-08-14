import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://ai-micro-drama.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;
