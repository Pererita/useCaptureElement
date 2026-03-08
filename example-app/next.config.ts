import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/useCaptureElement",
  trailingSlash: true, 
  images: {
    unoptimized: true,
  },
};

export default nextConfig;