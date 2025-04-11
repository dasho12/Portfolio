import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["blog.scottlogic.com", "th.bing.com"], // энд хэрэглэж буй зурагны hostname-ийг бичнэ
  },
  eslint: {
    // ESLint тохиргоо (зөвхөн хүсвэл)
    ignoreDuringBuilds: true, // ESLint-ийн алдаа үед build хийх боломжтой
  },
};

export default nextConfig;
