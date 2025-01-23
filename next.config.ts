import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
  },
};

export default nextConfig;
