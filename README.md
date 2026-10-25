# LeaveFlow

Leave management for small companies. This is the lab repository for
**Modern Software Engineering with Agentic AI, Part 1** (Modules 1 to 3).

It runs. It also has deliberate gaps, one for each thing the course teaches you
to find. The gaps are catalogued in [GAPS.md](GAPS.md), which is the instructor's
answer key. **If you are a participant, do not open GAPS.md until Day 2 closes.**

## Stack

Every layer, what it does here, and why it was chosen. Versions are the ones
pinned in `package.json`; run `npm ls --depth=0` to see what actually installed.

### Runtime and toolchain

| Component | Version        | Role                                                        |
| --------- | -------------- | ----------------------------------------------------------- |
| Node.js   | 22.12 or newer | Runtime for Next, the Prisma CLI and the seed script        |
| npm       | 9 or newer     | Package manager, and the only one this repo supports        |
| tsx       | 4.23           | Runs `prisma/seed.ts` without a separate build step         |
| dotenv    | 18             | Loads `.env` into `prisma.config.ts` before Prisma reads it |

**Node 22.12 or newer is the floor.** Next 16 asks for 20.9, but Vitest 5 is
stricter and requires 22.12, 24, or 26 and above, so the stricter constraint wins.
Versions 22.12 through 24 and 26 all work. Node 25 does not, because Vitest does
not publish it.

**npm 9 or newer.** The lockfile is format version 3, which npm 9 made the
default. Older npm may rewrite it on install, which changes the dependency tree
you get.

The repo ships a `package-lock.json`, so `npm install` reproduces the exact tree.
Do not mix in `pnpm` or `yarn`; you will get a different dependency graph and the
Turbopack warning described under [Run it](#run-it).

### Framework: Next.js 16.4.3

The App Router, not the Pages Router. Server components read the database
directly; client components handle the one interactive form.

| Piece                    | Where                                                       |
| ------------------------ | ----------------------------------------------------------- |
| App Router routes        | `src/app/**/page.tsx`                                       |
| Route handlers (the API) | `src/app/api/**/route.ts`                                   |
| Root layout and metadata | `src/app/layout.tsx`                                        |
| Turbopack bundler        | `next dev` and `next build`, configured in `next.config.ts` |

Two Next 16 features are switched off in `next.config.ts`, both on purpose:
`cacheComponents` and `partialPrefetching`. They expect every dynamic route to
opt in with `use cache`. The lab app is deliberately plain: it reads Prisma on
every request and caches nothing. A participant should not have to reason about
a caching layer to understand where state lives.

Turbopack is both the dev server and the production bundler in Next 16, so there
is no webpack configuration in this repository.

### UI: React 19.3

Server components by default. `DecisionForm.tsx` is the only file with
`"use client"`, because it is the only one with state and an event handler.

This split is itself a teaching point. Session 3.1's slide on instructions
versus context has a sibling here: server components are where durable data
lives, client components are where interaction lives, and mixing them badly is
how you end up with a fetch in a render.

### Language: TypeScript 5.9, strict

`strict: true` in `tsconfig.json`, plus the `@/*` path alias mapped to `src/*`.
Every source file is `.ts` or `.tsx`; there is no JavaScript in `src/`.

One honest limit, and it is gap Q3: TypeScript checks nothing at the HTTP
boundary. A `curl` request bypasses every type you wrote. That is why the
validation gap is real and why Lab 2B is asked to find it.

### Styling: Tailwind CSS 4

Tailwind 4 is CSS-first. There is **no `tailwind.config.js`** in this repository,
which surprises people who have used Tailwind 3. Configuration lives in CSS,
inside `src/app/globals.css`:

```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

`@import "tailwindcss"` replaces the three `@tailwind` directives from v3.
`@theme inline` is where design tokens are declared.

The plugin is `@tailwindcss/postcss` (4.3) wired up in `postcss.config.mjs`, so
Tailwind runs as a PostCSS step rather than as a Turbopack loader. That choice
keeps the build path conventional and gives you a PostCSS config to point at when
teaching how CSS reaches the browser. `postcss` 8 is the runner underneath it.

No component library, no CSS-in-JS, no design system. Every class you see is a
Tailwind utility written by hand, so a participant can read a component and know
exactly what styles it, which is what you want in a lab about reading code.

### Data: Prisma 7.10 with the better-sqlite3 driver adapter

| Package                          | Role                                          |
| -------------------------------- | --------------------------------------------- |
| `prisma`                         | CLI: `db push`, `generate`, `studio`          |
| `@prisma/client`                 | Generated, typed query client                 |
| `@prisma/adapter-better-sqlite3` | Prisma 7 driver adapter for SQLite            |
| `better-sqlite3`                 | The actual SQLite driver, synchronous, native |

Prisma 7 changed two things that matter, and both will trip up anyone following
an older tutorial:

**The datasource URL is no longer in `schema.prisma`.** It moved to
`prisma.config.ts`, read through `env("DATABASE_URL")`. A `url = env(...)` line
in the schema is now a hard validation error.

**The client is constructed with a driver adapter.** `src/lib/db.ts` builds a
`PrismaBetterSqlite3` adapter and passes it to `new PrismaClient({ adapter })`.
There is no implicit connection string.

The generated client is written to `src/generated/prisma`, not
`node_modules/.prisma`, and it is gitignored. `npm run build` regenerates it
first, so a fresh clone never needs a manual `prisma generate`.

`better-sqlite3` is a native module. If npm skipped its install script you will
get `Cannot find module 'better-sqlite3'`, and `npm rebuild better-sqlite3`
fixes it. This is the most common setup failure on a new machine.

### Database: SQLite

One file, `prisma/dev.db`, gitignored and recreated by `npm run db:reset`.

Chosen for the lab, not for production. It means no Docker, no service to start,
no credentials, and a database that works on a plane. A participant can open it
with any SQLite browser and see the exact rows the app sees.

The trade-off, stated plainly: SQLite has no concurrent writers, no roles, and no
row-level security. Every access-control gap in this repo (F2, F7) is more
dangerous on a real database, and that is worth saying out loud in Lab 2B.

Swapping to Postgres is a two-line change to `schema.prisma` plus a different
adapter. The domain code does not care.

### Testing: Vitest 5, Testing Library, Stryker 9

| Package                          | Version | Role                                        |
| -------------------------------- | ------- | ------------------------------------------- |
| `vitest`                         | 5.0     | Test runner, Vite-native, no separate build |
| `@vitejs/plugin-react`           | 5.1     | JSX and Fast Refresh inside the test build  |
| `jsdom`                          | 28.1    | Browser-like DOM for component tests        |
| `@testing-library/react`         | 16.3    | Render and query components as a user would |
| `@testing-library/user-event`    | 14.6    | Realistic click and type events             |
| `@testing-library/jest-dom`      | 6.9     | DOM matchers such as `toBeVisible`          |
| `@vitest/coverage-v8`            | 5.0     | Coverage via V8, no instrumentation step    |
| `@stryker-mutator/core`          | 9.6     | Mutation testing engine                     |
| `@stryker-mutator/vitest-runner` | 9.6     | Stryker plugin that drives Vitest           |

Configuration is `vitest.config.mts`. The `.mts` extension matters, because a
`.ts` file loaded as CommonJS throws a Vite warning. It sets `jsdom`, the `@`
alias, and coverage scoped to `src/lib`.

Only `src/lib` is under test, and deliberately thin. Nine tests, all passing, and
a mutation score of 7.14 percent. That is not neglect: it is gap T3, and Lab 3F
plus the mutation extension exist because of it.

`stryker.config.json` scopes mutation to `src/lib/leave.ts`. Mutating the whole
app takes minutes; mutating one domain module takes six seconds, which is what
you need in a 50-minute lab.

### Quality: ESLint 9 and Prettier 3

| Package              | Version | Role                                                     |
| -------------------- | ------- | -------------------------------------------------------- |
| `eslint`             | 9.39    | Flat-config linter                                       |
| `eslint-config-next` | 16.4    | Next's rules: `core-web-vitals` and `typescript` presets |
| `prettier`           | 3.9     | Formatter, no linter rules                               |
| `@types/*`           | n/a     | Type definitions for Node, React, DOM and better-sqlite3 |

`eslint.config.mjs` is **flat config**, the ESLint 9 format. `eslint-config-next`
16 exports flat config directly, so there is no `FlatCompat` wrapper in this
repo. An older tutorial will show one; it is no longer needed.

Lint rules come from `next/core-web-vitals` and `next/typescript`. Generated
Prisma output and build artifacts are ignored, so lint stays fast and never
reports on code nobody wrote.

Prettier settings live in `.prettierrc`: double quotes, semicolons, 90-character
lines. `.prettierignore` keeps it away from `src/generated` and lockfiles.

`npm run format` rewrites; `npm run format:check` fails without touching, which
is the version a CI job should use.

### What is deliberately absent

| Absent                 | Why                                                   |
| ---------------------- | ----------------------------------------------------- |
| Authentication library | Gap F7. Adding it is a Sprint 1 story                 |
| Component library      | Hand-written Tailwind keeps components readable       |
| State manager          | One client component does not need one                |
| Fetch wrapper          | `fetch` directly, so error handling gaps stay visible |
| Validation library     | Gap Q3, the missing runtime boundary                  |
| CI workflow            | Gap P1, in `.github/workflows/README.md`              |
| Docker                 | SQLite makes it unnecessary                           |

Each absence is either a gap to find or a complexity the labs do not need.

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

That is the whole setup. There is no service to start, no Docker, no database
server. SQLite lives in `prisma/dev.db`.

### If something goes wrong

**`Cannot find module 'better-sqlite3'`.** The install script that compiles it
was skipped. Recent npm versions hold back install scripts by default.

```bash
npm rebuild better-sqlite3
```

**`prisma: command not found`, or the client fails to generate.** Same cause.
Run `npm rebuild`, then `npm run db:push` again. If you are behind a corporate
proxy, `PRISMA_ENGINES_MIRROR` is the escape hatch.

**A Turbopack warning about a lockfile outside the repository.** `next.config.ts`
pins `turbopack.root` to this directory, so you should not see it. If you do,
you have an older copy of the config: check that `turbopack.root` is present.

**Dates render differently on two machines.** That is not a bug in your setup. It
is gap Q5, and Lab 2B is where you write it down.

**The page shows stale numbers after you change the database.** Every page is
`force-dynamic`, so a refresh is enough. If it persists, stop the server, delete
`.next`, and start it again.

## Verify it

```bash
npm run typecheck    # tsc --noEmit
npm run lint
npm test             # 9 tests, all passing by design
npm run build
npm run test:mutation  # 7.14 percent, 39 survivors. That is the lesson.
```

## Reset the database

The app writes to `prisma/dev.db`. After a lab where you approve, reject or
submit something, the seed data is no longer pristine. Reset it in one command:

```bash
npm run db:reset
```

That deletes `prisma/dev.db`, recreates the schema from `prisma/schema.prisma`,
and runs the seed. You should see:

```
removed prisma/dev.db

$ npm run db:push
$ npm run db:seed
Seeded: { employees: 5, balances: 5, requests: 6 }

Database reset. Expected state: 5 employees, 5 balances, 6 requests.
```

Run it at the start of every session. Several labs depend on the seeded state:
Priya's two overlapping requests (gap F3) and Nadia's drifted balance (gap F4)
only exist in a freshly seeded database.

**Why not `prisma db push --force-reset`?** Prisma 7 requires interactive
consent before any destructive command, so it cannot be scripted, run in CI, or
called by an agent. `npm run db:reset` deletes the file directly, which works
everywhere and is easier to audit. The script is `scripts/reset-db.mjs`, and it
touches nothing outside `prisma/dev.db`.

**If you want to inspect the data** rather than reset it:

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555, with a table browser.

**If you want to roll the whole thing back** to a fresh clone:

```bash
git clean -xdf && npm install
cp .env.example .env
npm run db:reset
```

`-x` removes ignored files, which includes `node_modules`, `.next`, `.env` and
`prisma/dev.db`. Use it deliberately: it deletes all four.

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

## A note on AGENTS.md

Next 16 writes an `AGENTS.md` file into the project on first `next dev` when it
detects an AI coding agent. This repository sets `agentRules: false` in
`next.config.ts` to suppress it.

The reason is pedagogical. Lab 3A asks you to author `CLAUDE.md` yourself, and a
scaffolded agent file from the framework would hand you a starting point you were
meant to derive. If you want to see what Next generates, delete the flag, run
`npm run dev`, and compare the result with what you wrote.

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

## License

MIT. Use it in your own training.
