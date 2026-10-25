import { describe, expect, it } from "vitest";
import {
  calculateWorkingDays,
  canCancel,
  hasSufficientBalance,
  resolveApprover,
} from "@/lib/leave";

/**
 * Partial test suite, deliberately.
 *
 * GAP-T1: no test for public holidays (course Lab 3F and the mutation testing
 * extension both rely on this being missing).
 * GAP-T2: no overlap test, because the feature does not exist.
 * GAP-T3: assertions are thin in places, which is what mutation testing
 * surfaces.
 */
describe("calculateWorkingDays", () => {
  it("counts a single weekday as one day", () => {
    const days = calculateWorkingDays({
      startDate: new Date("2026-03-02"),
      endDate: new Date("2026-03-02"),
    });
    expect(days).toBe(1);
  });

  it("excludes Saturday and Sunday", () => {
    // Friday 6 March 2026 through Monday 9 March 2026.
    const days = calculateWorkingDays({
      startDate: new Date("2026-03-06"),
      endDate: new Date("2026-03-09"),
    });
    expect(days).toBe(2);
  });

  it("throws when the end date precedes the start date", () => {
    expect(() =>
      calculateWorkingDays({
        startDate: new Date("2026-03-09"),
        endDate: new Date("2026-03-06"),
      }),
    ).toThrow();
  });

  // GAP-T1: a holiday case belongs here. It is the Lab 3F gap.
  // Example: 2026-03-09 is not a holiday, but 2026-05-01 is Labour Day.
});

describe("hasSufficientBalance", () => {
  it("returns true when the request fits inside the remaining balance", () => {
    expect(hasSufficientBalance(4, 14, 5)).toBe(true);
  });

  it("returns false when the request exceeds the remaining balance", () => {
    expect(hasSufficientBalance(10, 14, 5)).toBe(false);
  });

  // GAP-T3: no boundary test at exactly remaining == requested.
});

describe("resolveApprover", () => {
  it("returns the direct manager", () => {
    expect(resolveApprover({ id: "e1", managerId: "m1" })).toBe("m1");
  });

  it("returns null when the employee has no manager", () => {
    expect(resolveApprover({ id: "e1", managerId: null })).toBeNull();
  });

  // GAP-F1: no test for requester == manager, because the function cannot
  // express that case.
});

describe("canCancel", () => {
  it("allows the requester to cancel a pending request", () => {
    expect(canCancel({ employeeId: "e1", status: "PENDING" }, "e1")).toBe(true);
  });

  it("refuses a different employee", () => {
    expect(canCancel({ employeeId: "e1", status: "PENDING" }, "e2")).toBe(false);
  });

  // GAP-F5: no case for cancelling an APPROVED request, because it is
  // unsupported by design.
});
