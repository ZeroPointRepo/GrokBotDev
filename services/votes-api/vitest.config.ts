import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.ts'],
    pool: 'forks',
    /**
     * ONE test file at a time. The integration suites all point at the SAME Postgres database and
     * the same tables: each migrates on `beforeAll` (GRANT takes ACCESS EXCLUSIVE) and then wipes
     * its tables between tests. Run in parallel they interleave a multi-table `delete` with
     * another file's GRANTs in a different order, which Postgres correctly reports as
     * `deadlock detected` or `tuple concurrently updated` — an intermittent failure that says
     * nothing about the code under test. Parallelism buys nothing here anyway; the whole suite is
     * a couple of seconds.
     *
     * The migrator's advisory lock (src/db/migrate.ts) is the other half of this and is NOT
     * redundant: it protects production, where a deploy can overlap a restart with `db:migrate`.
     */
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
