import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components and partial prefetching are Next 16 features that expect
  // every dynamic page to use `use cache`. The lab app is deliberately plain:
  // server components reading Prisma, no caching layer to misunderstand.
  cacheComponents: false,
  partialPrefetching: false,
};

export default nextConfig;
