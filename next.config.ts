import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // If deploying to a subdirectory, uncomment and set:
  // basePath: "/your-subdirectory",
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;

