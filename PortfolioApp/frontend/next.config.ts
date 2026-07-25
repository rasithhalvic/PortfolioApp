/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/PortfolioApp',
  assetPrefix: '/PortfolioApp/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
