import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

/**
 * Seed data for the course.
 *
 * Shaped so that every lab has something to find:
 *   - Nadia's annualUsed (11) does not match her approved history (8 days).
 *     That is GAP-F4, and Lab 2B's gap register should catch it.
 *   - Two of Priya's requests overlap. GAP-F3, findable by query.
 *   - One request has no manager decision and no approver. GAP-F1.
 */
async function main() {
  await prisma.leaveRequest.deleteMany();
  await prisma.leaveBalance.deleteMany();
  await prisma.employee.deleteMany();

  const hr = await prisma.employee.create({
    data: { email: "hr@acme.test", name: "Hana Razak", role: "HR_ADMIN" },
  });

  const manager = await prisma.employee.create({
    data: {
      email: "manager@acme.test",
      name: "Farid Osman",
      role: "MANAGER",
      managerId: hr.id,
    },
  });

  const nadia = await prisma.employee.create({
    data: { email: "nadia@acme.test", name: "Nadia Kamaruddin", managerId: manager.id },
  });

  const priya = await prisma.employee.create({
    data: { email: "priya@acme.test", name: "Priya Raman", managerId: manager.id },
  });

  const wei = await prisma.employee.create({
    data: { email: "wei@acme.test", name: "Wei Lim", managerId: manager.id },
  });

  // Hana is her own manager's manager, which exposes GAP-F1 in resolution.
  await prisma.leaveBalance.createMany({
    data: [
      { employeeId: nadia.id, year: 2026, annualTotal: 14, annualUsed: 11 },
      { employeeId: priya.id, year: 2026, annualTotal: 14, annualUsed: 4 },
      { employeeId: wei.id, year: 2026, annualTotal: 14, annualUsed: 0 },
      { employeeId: manager.id, year: 2026, annualTotal: 18, annualUsed: 2 },
      { employeeId: hr.id, year: 2026, annualTotal: 18, annualUsed: 6 },
    ],
  });

  await prisma.leaveRequest.createMany({
    data: [
      {
        employeeId: nadia.id,
        leaveType: "ANNUAL",
        startDate: new Date("2026-04-06"),
        endDate: new Date("2026-04-10"),
        days: 5,
        reason: "Family trip",
        status: "APPROVED",
        decidedById: manager.id,
        decidedAt: new Date("2026-03-20"),
      },
      {
        // GAP-F4: 5 approved days above, but annualUsed says 11.
        employeeId: nadia.id,
        leaveType: "ANNUAL",
        startDate: new Date("2026-06-15"),
        endDate: new Date("2026-06-17"),
        days: 3,
        reason: "Wedding",
        status: "APPROVED",
        decidedById: manager.id,
        decidedAt: new Date("2026-05-30"),
      },
      {
        employeeId: priya.id,
        leaveType: "ANNUAL",
        startDate: new Date("2026-07-20"),
        endDate: new Date("2026-07-24"),
        days: 5,
        reason: "Holiday",
        status: "PENDING",
      },
      {
        // GAP-F3: overlaps the request above, and both are live.
        employeeId: priya.id,
        leaveType: "ANNUAL",
        startDate: new Date("2026-07-22"),
        endDate: new Date("2026-07-28"),
        days: 5,
        reason: "Extended break",
        status: "PENDING",
      },
      {
        employeeId: wei.id,
        leaveType: "MEDICAL",
        startDate: new Date("2026-08-03"),
        endDate: new Date("2026-08-03"),
        days: 1,
        reason: "Clinic",
        status: "REJECTED",
        decidedById: manager.id,
        decidedAt: new Date("2026-08-04"),
      },
      {
        // GAP-F1: no approver resolved, so it can never progress.
        employeeId: hr.id,
        leaveType: "ANNUAL",
        startDate: new Date("2026-09-14"),
        endDate: new Date("2026-09-18"),
        days: 5,
        reason: "Conference",
        status: "PENDING",
      },
    ],
  });

  const counts = {
    employees: await prisma.employee.count(),
    balances: await prisma.leaveBalance.count(),
    requests: await prisma.leaveRequest.count(),
  };
  console.log("Seeded:", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
