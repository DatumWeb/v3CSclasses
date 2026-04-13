import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages. Set BASE_PATH when the site is served from a
 * project URL (e.g. https://user.github.io/cs356CSV3/ → BASE_PATH=/cs356CSV3).
 * Omit BASE_PATH for local file:// or root hosting.
 */
const basePath = process.env.BASE_PATH?.trim() || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
