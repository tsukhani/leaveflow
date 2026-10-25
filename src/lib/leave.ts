/**
 * LeaveFlow domain rules.
 *
 * Deliberate gaps for the course (see GAPS.md). Read this file as the
 * instructor would: each gap is a lesson, not a bug report.
 *
 *   GAP-Q2  calculateWorkingDays counts weekends but not public holidays.
 *   GAP-F3  No overlap check. Two requests over the same dates both succeed.
 *   GAP-F4  No balance reconciliation. annualUsed can drift from history.
 *   GAP-Q4  No approval audit trail. A decision overwrites the previous one.
 */

export type LeaveType = "ANNUAL" | "MEDICAL" | "UNPAID";

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Count the days a leave request consumes.
 *
 * GAP-Q2: weekends are excluded, public holidays are not. Malaysia has
 * 11 federal public holidays that this function bills as leave.
 */
export function calculateWorkingDays(range: DateRange): number {
  const start = new Date(range.startDate);
  const end = new Date(range.endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (end < start) {
    throw new Error("endDate must not be before startDate");
  }

  let days = 0;
  for (let t = start.getTime(); t <= end.getTime(); t += MS_PER_DAY) {
    const day = new Date(t).getDay();
    if (day !== 0 && day !== 6) {
      days += 1;
    }
  }
  return days;
}

/**
 * Whether an employee has enough balance for this request.
 *
 * GAP-F4: reads the denormalised LeaveBalance.annualUsed counter, which is
 * never rebuilt from LeaveRequest history. After a cancellation the counter
 * does not come back down.
 */
export function hasSufficientBalance(
  used: number,
  total: number,
  requested: number,
): boolean {
  return used + requested <= total;
}

/**
 * Which manager should decide this request.
 *
 * GAP-F1: single level only. If the direct manager is the requester, or is
 * absent, there is no escalation path and the request stalls.
 */
export function resolveApprover(employee: {
  id: string;
  managerId: string | null;
}): string | null {
  return employee.managerId;
}

/**
 * Whether a request may be cancelled by the given employee.
 *
 * GAP-F5: only the requester may cancel, and only while PENDING. Once
 * approved, nobody can back out, which forces HR to edit the database.
 */
export function canCancel(
  request: { employeeId: string; status: string },
  actorId: string,
): boolean {
  return request.employeeId === actorId && request.status === "PENDING";
}
