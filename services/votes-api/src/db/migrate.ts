import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import postgres from 'postgres';
import { SERVICE_ROOT, loadConfig } from '../config.js';

function literal(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

async function ensureRoles(sql: ReturnType<typeof postgres>, appPassword: string, adminPassword: string) {
  await sql.unsafe(`
    do $$
    begin
      if not exists (select 1 from pg_roles where rolname = 'votes_app') then
        create role votes_app login password ${literal(appPassword)};
      else
        alter role votes_app login password ${literal(appPassword)};
      end if;
      if not exists (select 1 from pg_roles where rolname = 'votes_admin') then
        create role votes_admin login password ${literal(adminPassword)};
      else
        alter role votes_admin login password ${literal(adminPassword)};
      end if;
    end
    $$;
  `);
}

/**
 * Session advisory lock held for the whole run, so two migrators can never overlap.
 *
 * Migrating is not just `create table if not exists`: `ensureRoles` runs ALTER ROLE and every
 * file re-applies its GRANTs. Those write catalog tuples (`pg_authid`, `pg_class`) that Postgres
 * will NOT serialise for us — a second migrator arriving mid-run dies with
 * `tuple concurrently updated`. That is exactly what vitest does when two integration suites
 * migrate the same database in parallel, and it is what a deploy does if a restart races the
 * `db:migrate` step. Arbitrary but stable key; `max: 1` guarantees the lock and the work share
 * one session.
 */
const MIGRATION_LOCK_KEY = 4391_0003;

export async function migrate() {
  const cfg = loadConfig();
  const sql = postgres(cfg.migrateDatabaseUrl, { max: 1, idle_timeout: 5, connect_timeout: 5, onnotice: () => {} });
  try {
    await sql`select pg_advisory_lock(${MIGRATION_LOCK_KEY})`;
    try {
      await ensureRoles(sql, cfg.appRolePassword, cfg.adminRolePassword);
      const migrationsDir = join(SERVICE_ROOT, 'migrations');
      const files = (await readdir(migrationsDir)).filter((name) => name.endsWith('.sql')).sort();
      for (const file of files) {
        const text = await readFile(join(migrationsDir, file), 'utf8');
        await sql.begin(async (tx) => {
          await tx.unsafe(text);
        });
        console.log(JSON.stringify({ at: new Date().toISOString(), level: 'info', message: 'migration_applied', file }));
      }
    } finally {
      await sql`select pg_advisory_unlock(${MIGRATION_LOCK_KEY})`;
    }
  } finally {
    await sql.end({ timeout: 5 });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  migrate().catch((error) => {
    console.error(JSON.stringify({ at: new Date().toISOString(), level: 'error', message: 'migration_failed', error: error.message }));
    process.exit(1);
  });
}
