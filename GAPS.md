# LeaveFlow: the deliberate gaps

This repository works. It also contains gaps, one for each thing the course
teaches you to find. This file is the instructor's answer key.

**Participants should not read this file before Day 2 closes.** If you are a
participant, close this tab and run the labs.

Every gap below was verified against the running application, not just read in
the source.

---

## Functional gaps

| ID  | Gap                                                                          | Where                                       | Lab        |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------- | ---------- |
| F1  | Approval is single-level and stalls when the requester is their own manager  | `src/lib/leave.ts` `resolveApprover`        | 2B         |
| F2  | The decide endpoint has no authorization. Any caller can approve any request | `src/app/api/requests/[id]/decide/route.ts` | 2B, 3F     |
| F3  | No overlap detection. The same dates can be booked repeatedly                | `src/app/api/requests/route.ts`             | 1C, 2B     |
| F4  | `annualUsed` is a stored counter that never reconciles with request history  | `src/app/api/requests/[id]/decide/route.ts` | 2B         |
| F5  | An approved request cannot be cancelled by anyone, including an admin        | `src/lib/leave.ts` `canCancel`              | 2B         |
| F6  | No pagination on the requests list                                           | `src/app/api/requests/route.ts`             | 2B (minor) |
| F7  | No authentication. Every page shows every employee's requests                | `src/app/requests/page.tsx`                 | 2B         |

## Quality gaps

| ID  | Gap                                                                         | Where                                     | Lab        |
| --- | --------------------------------------------------------------------------- | ----------------------------------------- | ---------- |
| Q2  | Public holidays are billed as leave. Malaysia has 11 federal holidays       | `src/lib/leave.ts` `calculateWorkingDays` | 1C, 3F     |
| Q3  | No runtime input validation. TypeScript checks nothing at the HTTP boundary | `src/app/api/requests/route.ts` POST      | 2B         |
| Q4  | No approval audit trail. A decision overwrites the previous one             | `decide/route.ts`, Prisma schema          | 2B, 3F     |
| Q5  | Dates render in the server's locale and timezone, so they differ by user    | `src/lib/format.ts`                       | 2B (minor) |
| Q6  | The decision form has no error surface and no confirmation                  | `src/components/DecisionForm.tsx`         | 2B         |

## Accessibility gaps

Both are deliberate and both fail WCAG 2.2 AA, which `openspec/specs/leave-requests/spec.md` requires.

| ID  | Gap                                                     | Where                                  |
| --- | ------------------------------------------------------- | -------------------------------------- |
| A1  | Status conveyed by colour, no programmatic announcement | `src/components/StatusBadge.tsx`       |
| A2  | Table has no caption and no `scope` on headers          | `src/components/LeaveRequestTable.tsx` |

## Test gaps

| ID  | Gap                                                                  | Why it matters                                                              |
| --- | -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| T1  | No public-holiday test                                               | This is the Lab 3F target, and the mutation testing extension's whole point |
| T2  | No overlap test                                                      | The feature does not exist, so neither does the test                        |
| T3  | Thin assertions in place, e.g. no boundary at remaining == requested | Mutation score is 7.14 percent, 39 survivors                                |

## Process gaps

These four are absences rather than defects, so you will not find a `GAP-Pn`
comment in the source. The absence is the gap.

| ID  | Gap                                      | Where                                        |
| --- | ---------------------------------------- | -------------------------------------------- |
| P1  | No CI workflow. Nothing runs on push     | `.github/workflows/` is intentionally absent |
| P2  | No `CLAUDE.md`. Lab 3A creates it        | repository root                              |
| P3  | No skill, no hooks, no MCP config        | Lab 3B, 3D, 3E create them                   |
| P4  | Tests are not wired into `npm run build` | `package.json`                               |

---

## Verified evidence for each gap

Run these yourself before teaching. Each command reproduces the gap.

### F3, overlapping requests both succeed

```
curl -s -X POST localhost:3000/api/requests -H 'content-type: application/json' \
  -d '{"employeeId":"<priya>","leaveType":"ANNUAL","startDate":"2026-07-21","endDate":"2026-07-23"}'
```

Returns 201. Priya already has 20 to 24 July and 22 to 28 July pending.

### F2, approve without authorization

```
curl -s -X POST localhost:3000/api/requests/<id>/decide \
  -H 'content-type: application/json' \
  -d '{"decision":"APPROVED","actorId":"anyone-at-all"}'
```

Returns `status: APPROVED`, `decidedById: anyone-at-all`.

### Q4, decision history overwritten

Run the decide call twice with different actorIds. The second decision replaces
the first, and no record of the first survives.

### F4, counter disagrees with history

Nadia's `annualUsed` is 11. Her approved requests total 8 days. Both are visible
in `GET /api/balances` and `GET /api/requests?employeeId=<nadia>`.

### Q2, public holiday billed

30 April to 4 May 2026 contains Labour Day and Wesak Day. The app bills 3 days,
and the correct answer is 1.

### T3, mutation score

```
npm run test:mutation
```

Reports 7.14 percent with 39 surviving mutants. Every survivor is an assertion
the tests do not make.

---

## How the gaps map to the two days

| Session                | Uses which gaps                                                    |
| ---------------------- | ------------------------------------------------------------------ |
| 1.1 Jira and stories   | F7, Q3, A1, A2 as the "vague request" the stories must clarify     |
| 1.2 BMad planning      | The whole repo as the object of a PRD                              |
| 1.3 OpenSpec           | F3, Q2 via the two shipped change proposals                        |
| 2.1 Prioritization     | All of the above, as the backlog to rank                           |
| 2.2 Gap analysis       | The full register. This is where GAPS.md is the answer key         |
| 2.3 Sprint planning    | Which gaps become Sprint 1 stories                                 |
| 3.1 Claude Code memory | P2, and the conventions that would prevent Q5                      |
| 3.2 Skills             | A `spec-implementation` skill run against F3                       |
| 3.3 MCP                | The health endpoint, and the database behind it                    |
| 3.4 Hooks              | A formatter hook, and a PreToolUse block on `prisma/schema.prisma` |
| 3.5 Workflows          | F3 or Q2 implemented end to end, with a deviation report           |

---

## Intentional non-gaps

Do not "fix" these. They are correct, and confusing them with gaps is a
teaching moment in itself.

- `calculateWorkingDays` throws on a reversed date range. That is right.
- Medical leave does not check a balance. Malaysia has no statutory cap here.
- The Prisma client lives in `src/generated/`. Generated, not hand-edited.
- SQLite. The course runs offline; swap the datasource for Postgres if you want.
