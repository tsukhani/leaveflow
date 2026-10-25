"use client";

import { useState } from "react";

/**
 * GAP-Q6: no optimistic update, no error surface, and no confirmation. The form
 * reports success by clearing itself, which is indistinguishable from a silent
 * failure if the request fails.
 */
export function DecisionForm({
  requestId,
  employeeName,
}: {
  requestId: string;
  employeeName: string;
}) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function decide(decision: "APPROVED" | "REJECTED") {
    setBusy(true);
    await fetch(`/api/requests/${requestId}/decide`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ decision, actorId: "manager@acme.test" }),
    });
    setBusy(false);
    setDone(true);
  }

  if (done) {
    return (
      <p className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
        Decision recorded. Reload to see the updated list.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4">
      <p className="mr-auto text-sm text-zinc-600">
        Acting on {employeeName}&apos;s request.
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={() => decide("REJECTED")}
        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 disabled:opacity-50"
      >
        Reject
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => decide("APPROVED")}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
      >
        Approve
      </button>
    </div>
  );
}
