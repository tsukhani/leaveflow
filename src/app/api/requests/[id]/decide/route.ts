import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/requests/:id/decide
 *
 * GAP-Q4: the decision overwrites status and writes decidedBy/decidedAt over
 * any previous value. No LeaveApproval row is created, so there is no audit
 * trail and no way to reconstruct who approved what before a reversal.
 *
 * GAP-F2: no authorization check that the actor is the resolved approver.
 * Any authenticated caller can approve any request.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const decision = body.decision;

  if (decision !== "APPROVED" && decision !== "REJECTED") {
    return NextResponse.json(
      { error: "decision must be APPROVED or REJECTED" },
      { status: 400 },
    );
  }

  const existing = await prisma.leaveRequest.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const updated = await prisma.leaveRequest.update({
    where: { id },
    data: {
      status: decision,
      decidedById: body.actorId ?? null,
      decidedAt: new Date(),
    },
  });

  // GAP-F4: the balance counter is incremented but never decremented on
  // rejection reversal or cancellation.
  if (decision === "APPROVED" && existing.leaveType === "ANNUAL") {
    await prisma.leaveBalance.updateMany({
      where: { employeeId: existing.employeeId },
      data: { annualUsed: { increment: existing.days } },
    });
  }

  return NextResponse.json({ request: updated });
}
