import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components and partial prefetching are Next 16 features that expect
  // every dynamic page to use `use cache`. The lab app is deliberately plain:
  // server components reading Prisma, no caching layer to misunderstand.
  cacheComponents: false,
  partialPrefetching: false,

  // Lab 3A asks participants to author CLAUDE.md from scratch. Next 16 writes
  // its own AGENTS.md on first `next dev` when it detects an AI coding agent,
  // which would do that thinking for them. Off, deliberately.
  agentRules: false,

  turbopack: {
    // Pin the Turbopack root to this project directory. Without this, Turbopack
    // walks upward looking for a lockfile and can resolve outside the repo,
    // which produces a warning on machines with a lockfile in the home folder.
    root: import.meta.dirname,
  },
};

export default nextConfig;
