#!/usr/bin/env node
/**
 * Reset the local SQLite database to its seeded state.
 *
 * Deletes prisma/dev.db, recreates the schema from prisma/schema.prisma, then
 * runs the seed. Written as a script rather than `prisma db push --force-reset`
 * for two reasons:
 *
 *   1. Prisma 7 requires explicit interactive consent before it will run a
 *      destructive command, which makes `--force-reset` unusable in a script,
 *      a CI job, or an agent session.
 *   2. Deleting the file is obvious. A participant can read this and see
 *      exactly what is destroyed.
 *
 * The database is local development data only. Nothing here touches anything
 * outside prisma/dev.db.
 */
import { existsSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dbFile = path.join(root, "prisma", "dev.db");
const journal = `${dbFile}-journal`;

for (const file of [dbFile, journal]) {
  if (existsSync(file)) {
    rmSync(file, { force: true });
    console.log(`removed ${path.relative(root, file)}`);
  }
}

function run(script) {
  console.log(`\n$ npm run ${script}`);
  execSync(`npm run ${script}`, { cwd: root, stdio: "inherit" });
}

run("db:push");
run("db:seed");

console.log("\nDatabase reset. Expected state: 5 employees, 5 balances, 6 requests.");
