import Link from "next/link";
import { prisma } from "@/lib/db";

// Always read live data. A lab repository that serves stale rows teaches
// the wrong lesson about where state lives.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [employees, requests, pending] = await Promise.all([
    prisma.employee.count(),
    prisma.leaveRequest.count(),
    prisma.leaveRequest.count({ where: { status: "PENDING" } }),
  ]);

  const stats = [
    { label: "Employees", value: employees },
    { label: "Requests", value: requests },
    { label: "Pending decisions", value: pending },
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10">
        <p className="text-sm font-medium text-emerald-700">LeaveFlow</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">
          Leave management for small companies
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-600">
          Request leave, approve it, and keep the balance honest. This is the course lab
          repository: it works, and it has deliberate gaps for you to find.
        </p>
      </header>

      <section className="mb-10 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-5"
          >
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-zinc-900">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/requests"
          className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-sm"
        >
          <h2 className="font-semibold text-zinc-900">My requests</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Submit leave and track what has been decided.
          </p>
        </Link>
        <Link
          href="/approvals"
          className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-sm"
        >
          <h2 className="font-semibold text-zinc-900">Approvals</h2>
          <p className="mt-1 text-sm text-zinc-600">
            See what is waiting on you as a manager.
          </p>
        </Link>
        <Link
          href="/api/health"
          className="rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-sm"
        >
          <h2 className="font-semibold text-zinc-900">Health</h2>
          <p className="mt-1 text-sm text-zinc-600">
            JSON probe. Also the MCP database check.
          </p>
        </Link>
      </section>
    </main>
  );
}
