import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeaveFlow",
  description:
    "Leave management for small companies. Course lab repository for Modern Software Engineering with Agentic AI.",
};

// Props typed explicitly rather than relying on Next's generated LayoutProps,
// so `npm run typecheck` passes on a clean clone before any build.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
        {children}
      </body>
    </html>
  );
}
