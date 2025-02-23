/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/useCaptureElement",
  assetPrefix: "/useCaptureElement/",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
