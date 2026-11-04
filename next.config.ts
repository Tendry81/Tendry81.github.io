import type { NextConfig } from "next";

// NEXT_OUTPUT=export → static export for GitHub Pages (CI).
// Otherwise → standalone server (local dev / AI Studio, with the /api/contact route).
const isStaticExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : "standalone",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
