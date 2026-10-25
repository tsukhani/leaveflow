import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/balances?employeeId=...
 *
 * GAP-Q4: returns the stored counters with no history beside them, so a user
 * cannot see why their balance is what it is.
 */
export async function GET(request: NextRequest) {
  const employeeId = request.nextUrl.searchParams.get("employeeId");

  const balances = await prisma.leaveBalance.findMany({
    where: employeeId ? { employeeId } : {},
    include: { employee: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json({ balances });
}
