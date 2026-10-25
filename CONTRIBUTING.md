# Contributing to LeaveFlow

Small repo, few rules. The rules that exist are the ones a course participant is
expected to encode into `CLAUDE.md` during Lab 3A.

## Commands

```bash
npm run dev          # http://localhost:3000
npm run build        # prisma generate, then next build
npm test             # vitest, must stay green
npm run test:coverage
npm run test:mutation
npm run lint
npm run typecheck
npm run format
```

## Conventions

- TypeScript strict. No `any` in `src/lib` or `src/app/api`.
- Domain logic lives in `src/lib`, not in route handlers or components.
- Route handlers validate input at the boundary. They currently do not, which is
  gap Q3.
- Dates are stored as UTC midnight. Display formatting is a UI concern.
- Never edit `src/generated/`. It is Prisma output.

## Test policy

- Every function in `src/lib` that makes a decision needs a test.
- No mocking the database in domain tests. Pass plain objects.
- A test that passes for the wrong reason is worse than no test. Mutation testing
  exists to catch exactly that, which is why `npm run test:mutation` is in the
  script list.

## Before you open a PR

```bash
npm run format:check && npm run lint && npm run typecheck && npm test
```

Note there is no CI pipeline in this repository. That is gap P1, and building one
is a reasonable Sprint 1 story.
