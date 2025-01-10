import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        // cors로 문제가 되었던 url 입력
        destination: "http://localhost:8000/api/v1/:path*/"
      }
    ]
  }
};

export default nextConfig;
