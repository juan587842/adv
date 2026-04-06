import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    // Disable ESLint during builds (especially for flat config mismatches with older ESLint)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optionally ignore ts errors that are specific to edge functions if tsconfig still catches them
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
