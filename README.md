# LeaveFlow

Leave management for small companies. This is the lab repository for
**Modern Software Engineering with Agentic AI, Part 1** (Modules 1 to 3).

It runs. It also has deliberate gaps, one for each thing the course teaches you
to find. The gaps are catalogued in [GAPS.md](GAPS.md), which is the instructor's
answer key. **If you are a participant, do not open GAPS.md until Day 2 closes.**

## Stack

| Layer           | Choice                                           |
| --------------- | ------------------------------------------------ |
| Framework       | Next.js 16, App Router, React 19                 |
| Language        | TypeScript 5.9, strict                           |
| Styling         | Tailwind CSS 4                                   |
| Data            | Prisma 7 with the better-sqlite3 driver adapter  |
| Database        | SQLite, so the lab runs offline with no services |
| Tests           | Vitest 5, Testing Library, Stryker for mutation  |
| Lint and format | ESLint 9, Prettier 3                             |

## Run it

```bash
git clone <this-repo>
cd leaveflow
npm install
cp .env.example .env
npm run db:push      # create prisma/dev.db
npm run db:seed      # 5 employees, 5 balances, 6 requests
npm run dev
```

Open http://localhost:3000.

## Verify it

```bash
npm run typecheck    # tsc --noEmit
npm run lint
npm test             # 9 tests, all passing by design
npm run build
npm run test:mutation  # 7.14 percent, 39 survivors. That is the lesson.
```

## What you are looking at

| Route                      | What it does                                               |
| -------------------------- | ---------------------------------------------------------- |
| `/`                        | Dashboard with counts                                      |
| `/requests`                | Every request in the system, because there is no auth      |
| `/approvals`               | Pending decisions, with a form that pretends to scope them |
| `/api/health`              | JSON probe, and the MCP database check                     |
| `/api/requests`            | GET list, POST create                                      |
| `/api/requests/:id/decide` | POST approve or reject                                     |
| `/api/balances`            | GET balances                                               |

## The two shipped change proposals

`openspec/changes/` contains two proposals, both deliberately incomplete. Lab 1C
asks you to fix them:

- `add-holiday-calendar` has one scenario where the spec requires two
- `enforce-overlap-check` is a MODIFIED requirement with no migration note

`openspec/specs/leave-requests/spec.md` is the spec of record. It describes the
system as it should be, which is not the system as it is. That difference is the
gap register you build in Lab 2B.

## Seed data worth knowing about

- **Priya Raman** has two pending requests that overlap: 20 to 24 July and 22 to
  28 July.
- **Nadia Kamaruddin** has `annualUsed` of 11 but only 8 days of approved
  history.
- **Hana Razak** is an HR admin whose manager is herself, so her request can
  never be approved.

## Layout

```
src/
  app/            routes; API handlers under app/api
  components/     StatusBadge, LeaveRequestTable, DecisionForm
  lib/            db.ts (Prisma client), leave.ts (domain), format.ts
  generated/      Prisma client output, do not edit
prisma/
  schema.prisma   data model, with gap notes in comments
  seed.ts         the six requests that make the gaps visible
tests/            Vitest; partial by design
openspec/         spec of record plus two incomplete change proposals
GAPS.md           instructor answer key
```

## Licence

MIT. Use it in your own training.
