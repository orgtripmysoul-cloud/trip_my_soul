import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Regression guard for the 42804 bug that broke every checkout: 0015
 * re-created create_booking_with_hold from pre-0014 source text, dropping the
 * ::payment_kind casts, and `case when ... then 'full' else 'advance' end`
 * resolves to text — which has no assignment cast to an enum.
 *
 * Asserting against a live database needs a database, which this suite does
 * not have; supabase/checks/payment_kind_cast.sql does that part against a
 * non-production branch. What is checked here is the thing that actually
 * regressed: a migration re-creating the function from stale source. Any
 * future migration that does so again fails this test.
 */
const MIGRATIONS_DIR = path.resolve(__dirname, "../../../supabase/migrations");

function migrationsDefining(fn: string): { name: string; body: string }[] {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map((name) => ({ name, body: fs.readFileSync(path.join(MIGRATIONS_DIR, name), "utf8") }))
    .filter(({ body }) => new RegExp(`create\\s+(or\\s+replace\\s+)?function\\s+${fn}\\b`, "i").test(body));
}

describe("create_booking_with_hold payment_kind cast", () => {
  const definitions = migrationsDefining("create_booking_with_hold");

  it("is defined by at least one migration", () => {
    expect(definitions.length).toBeGreaterThan(0);
  });

  // 0007 and 0012 are the pre-hotfix definitions. 0014 repairs whatever they
  // left behind on every database that ran them, so their source text is
  // deliberately left untouched — history, not the live definition. The
  // invariant that matters is that nothing re-creating the function *after*
  // 0014 may drop the casts again, which is exactly what 0015 did.
  const liveDefinitions = definitions.filter((d) => d.name > "0014");

  it.each(liveDefinitions)("$name casts the 'full' branch", ({ body }) => {
    expect(body).toContain("'full'::payment_kind");
  });

  it.each(liveDefinitions)("$name casts the 'advance' branch", ({ body }) => {
    expect(body).toContain("'advance'::payment_kind");
  });

  it.each(liveDefinitions)("$name leaves no uncast kind CASE", ({ body }) => {
    expect(body).not.toMatch(/then\s+'full'\s+else\s+'advance'\s+end/);
  });

  it("ships a migration that repairs an already-broken database", () => {
    const repair = fs.readFileSync(
      path.join(MIGRATIONS_DIR, "0019_restore_payment_kind_cast.sql"),
      "utf8"
    );
    expect(repair).toContain("pg_get_functiondef('create_booking_with_hold'::regproc)");
    expect(repair).toContain("'full'::payment_kind else 'advance'::payment_kind end");
  });
});
