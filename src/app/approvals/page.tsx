import { LeaveRequestTable } from "@/components/LeaveRequestTable";
import { DecisionForm } from "@/components/DecisionForm";
import { prisma } from "@/lib/db";

// Always read live data. A lab repository that serves stale rows teaches
// the wrong lesson about where state lives.
export const dynamic = "force-dynamic";

/**
 * Manager view of pending requests.
 *
 * GAP-F2: the decide endpoint trusts whatever actorId the client sends, so this
 * page can approve anything. The UI only pretends to scope it.
 */
export default async function ApprovalsPage() {
  const pending = await prisma.leaveRequest.findMany({
    where: { status: "PENDING" },
    include: { employee: { select: { name: true, email: true } } },
    orderBy: { startDate: "asc" },
  });

  const rows = pending.map((r) => ({
    ...r,
    startDate: r.startDate.toISOString(),
    endDate: r.endDate.toISOString(),
  }));

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Awaiting your decision
        </h1>
        <p className="mt-1 text-zinc-600">
          {pending.length} request{pending.length === 1 ? "" : "s"} pending.
        </p>
      </header>

      <LeaveRequestTable requests={rows} showEmployee />

      {pending.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-zinc-900">Record a decision</h2>
          <DecisionForm
            requestId={pending[0].id}
            employeeName={pending[0].employee.name}
          />
        </section>
      )}
    </main>
  );
}
