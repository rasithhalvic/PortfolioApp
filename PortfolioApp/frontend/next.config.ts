import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tells Next.js to build a static HTML/JS site for GitHub Pages
  output: 'export',
  // Disables server-side image rendering
  images: {
    unoptimized: true,
  },
};

export default nextConfig;