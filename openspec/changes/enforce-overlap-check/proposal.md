# Refuse overlapping leave requests

## Why

Two requests over the same dates both succeed. The seed data contains a live
example: Priya Raman has 20 to 24 July and 22 to 28 July both pending.

## What changes

Reject a submission that overlaps an existing non-cancelled request for the same
employee.

## Impact

- `src/app/api/requests/route.ts`: overlap query before create
- `src/lib/leave.ts`: new `overlaps` predicate
- New error path the frontend must render
