import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateWorkingDays, hasSufficientBalance } from "@/lib/leave";

/**
 * GET /api/requests?employeeId=...&status=...
 *
 * GAP-F6: no pagination. Fine for the seed data, and it will be the first
 * thing that breaks under a realistic volume.
 */
export async function GET(request: NextRequest) {
  const employeeId = request.nextUrl.searchParams.get("employeeId");
  const status = request.nextUrl.searchParams.get("status");

  const requests = await prisma.leaveRequest.findMany({
    where: {
      ...(employeeId ? { employeeId } : {}),
      ...(status ? { status: status as never } : {}),
    },
    include: { employee: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}

/**
 * POST /api/requests
 *
 * GAP-F3: no overlap detection. An employee can book the same dates twice and
 * both rows are written.
 * GAP-Q3: no input validation beyond what TypeScript does at compile time,
 * which does nothing for an HTTP caller.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const startDate = new Date(body.startDate);
  const endDate = new Date(body.endDate);
  const days = calculateWorkingDays({ startDate, endDate });

  const balance = await prisma.leaveBalance.findUnique({
    where: { employeeId: body.employeeId },
  });

  if (
    balance &&
    body.leaveType === "ANNUAL" &&
    !hasSufficientBalance(balance.annualUsed, balance.annualTotal, days)
  ) {
    return NextResponse.json(
      { error: "Insufficient annual leave balance" },
      { status: 409 },
    );
  }

  const created = await prisma.leaveRequest.create({
    data: {
      employeeId: body.employeeId,
      leaveType: body.leaveType ?? "ANNUAL",
      startDate,
      endDate,
      days,
      reason: body.reason ?? null,
    },
    include: { employee: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ request: created }, { status: 201 });
}
