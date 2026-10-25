import { LeaveRequestTable } from "@/components/LeaveRequestTable";
import { prisma } from "@/lib/db";

// Always read live data. A lab repository that serves stale rows teaches
// the wrong lesson about where state lives.
export const dynamic = "force-dynamic";

/**
 * GAP-F7: there is no employee switcher and no auth at all. The page shows every
 * request in the system. Session 1.1's story about "the employee sees their own
 * requests" is the gap.
 */
export default async function RequestsPage() {
  const requests = await prisma.leaveRequest.findMany({
    include: { employee: { select: { name: true, email: true } } },
    orderBy: { startDate: "desc" },
  });

  const rows = requests.map((r) => ({
    ...r,
    startDate: r.startDate.toISOString(),
    endDate: r.endDate.toISOString(),
  }));

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Leave requests
        </h1>
        <p className="mt-1 text-zinc-600">
          Every request in the system, because there is no sign-in yet.
        </p>
      </header>
      <LeaveRequestTable requests={rows} showEmployee />
    </main>
  );
}
