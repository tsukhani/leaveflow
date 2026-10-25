# Add a public holiday calendar

## Why

`calculateWorkingDays` excludes weekends but bills public holidays as leave. In
Malaysia that means an employee is charged for eleven days a year they are
entitled to.

## What changes

Add a `PublicHoliday` table and exclude gazetted holidays from the day count.
Requirements in `spec.md` are updated with an ADDED requirement.

## Impact

- `prisma/schema.prisma`: new model
- `src/lib/leave.ts`: `calculateWorkingDays` gains a holiday set parameter
- `src/app/api/requests/route.ts`: loads holidays before calculating
- Seed data: 2026 Malaysian federal holidays
