/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "out",
  images: {
    unoptimized: true,
  },
  basePath: "/useCaptureElement",
  assetPrefix: "/useCaptureElement/",
};

module.exports = nextConfig;
