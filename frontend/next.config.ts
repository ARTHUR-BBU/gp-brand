import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "https",
        hostname: "**.aliyuncs.com",
      },
    ],
  },
};

export default nextConfig;
