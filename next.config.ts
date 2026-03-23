import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/portfolio2' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/portfolio2/' : '',
  images: {
    unoptimized: true,
  },
  env: {
    googleAnalyticsId: process.env.NODE_ENV === "production" ? process.env.GA_MEASUREMENT_ID : "",
  }
};

export default nextConfig;
