/**
 * @module @kairos/database/seed
 * Phase 0 database seed script.
 * Generates INSERT SQL for the 10 Phase 0 historical figures with computed natal charts.
 *
 * Usage:
 *   pnpm --filter @kairos/database seed        # runs seed.ts via tsx
 *   pnpm --filter @kairos/database seed:sql    # dry-run, prints SQL only
 *
 * LL-003: Uses NEON_DATABASE_URL_UNPOOLED for direct migration connection.
 * LL-007: All expected values computed via the engine, not hardcoded.
 *
 * @see packages/astronomical-engine/src/core/natal-chart.ts
 * @see packages/database/src/figures.ts
 */

import { PHASE_0_FIGURES } from './figures.js';
import { computeNatalChart } from '@kairos/astronomical-engine';
import { dateToJDE } from '@kairos/astronomical-engine';
import { randomUUID } from 'crypto';

/** Whether to print SQL only (dry run). */
const DRY_RUN = process.argv.includes('--dry-run') || process.argv.includes('--sql');

/**
 * Converts fractional degrees to a Postgres-safe decimal string.
 */
function fmtDec(n: number | undefined): string {
  if (n === undefined) return 'NULL';
  return n.toFixed(6);
}

/**
 * Escapes a SQL string value.
 */
function sqlStr(s: string | undefined | null): string {
  if (s === null || s === undefined) return 'NULL';
  return `'${s.replace(/'/g, "''")}'`;
}

/**
 * Formats a date as a Postgres-compatible ISO string for the birth_date column.
 * For ancient dates (negative years), uses PostgreSQL's 'YYYY-MM-DD BC' format.
 */
function formatBirthDate(year: number, month: number, day: number): string {
  const d = Math.floor(day);
  const mm = String(month).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  if (year <= 0) {
    // Astronomical year 0 = 1 BC, -68 = 69 BC, etc.
    const bcYear = Math.abs(year) + 1;
    return `${String(bcYear).padStart(4, '0')}-${mm}-${dd} BC`;
  }
  return `${String(year).padStart(4, '0')}-${mm}-${dd}`;
}

/**
 * Generates INSERT SQL for all Phase 0 figures.
 * Computes natal charts via the astronomical engine and embeds natal aspects as JSONB.
 *
 * @returns Array of SQL INSERT statement strings
 */
function generateFigureInserts(): string[] {
  const inserts: string[] = [];

  for (const figure of PHASE_0_FIGURES) {
    const { birthData } = figure;
    const jde = dateToJDE(birthData.year, birthData.month, birthData.day, birthData.isGregorian);
    const chart = computeNatalChart({ jde, timeKnown: false });

    // Convert natal aspects to a compact JSON array for storage
    const natalAspectsJson = JSON.stringify(
      chart.natalAspects.map((a) => ({
        p1: a.planet1,
        p2: a.planet2,
        type: a.type,
        orb: parseFloat(a.currentOrb.toFixed(2)),
      })),
    );

    const birthDateStr = formatBirthDate(birthData.year, birthData.month, birthData.day);
    const id = randomUUID();

    const sql = [
      `INSERT INTO figures (`,
      `  id, name, birth_date, birth_date_precision,`,
      `  birth_location_lat, birth_location_lng, birth_time_known,`,
      `  archetype_school, primary_forge, secondary_forge,`,
      `  ruling_planet, natal_aspects, personal_lore, era`,
      `) VALUES (`,
      `  '${id}',`,
      `  ${sqlStr(figure.name)},`,
      `  '${birthDateStr}',`,
      `  ${sqlStr(figure.birthDatePrecision)},`,
      `  ${fmtDec(birthData.lat)}, ${fmtDec(birthData.lng)}, FALSE,`,
      `  ${sqlStr(figure.archetypeSchool)},`,
      `  ${sqlStr(figure.primaryForge)},`,
      `  ${sqlStr(figure.secondaryForge)},`,
      `  ${sqlStr(figure.rulingPlanet)},`,
      `  '${natalAspectsJson.replace(/'/g, "''")}',`,
      `  ${sqlStr(figure.personalLore)},`,
      `  ${sqlStr(figure.era)}`,
      `);`,
    ].join('\n');

    inserts.push(sql);
    console.log(`✓ Generated: ${figure.name} (JDE: ${jde.toFixed(2)}, aspects: ${chart.natalAspects.length})`);
  }

  return inserts;
}

/**
 * Main seed entry point.
 */
async function main(): Promise<void> {
  console.log('🌌 Kairos\' Council — Phase 0 Figure Seed\n');

  const inserts = generateFigureInserts();
  const fullSql = inserts.join('\n\n');

  if (DRY_RUN) {
    console.log('\n── Generated SQL ──────────────────────────────────');
    console.log(fullSql);
    console.log('───────────────────────────────────────────────────');
    console.log(`\n✅ Dry run complete — ${inserts.length} figures`);
    return;
  }

  // Live database execution
  const dbUrl = process.env['NEON_DATABASE_URL_UNPOOLED'];
  if (!dbUrl) {
    console.error('❌ NEON_DATABASE_URL_UNPOOLED is not set.');
    console.error('   Run with --dry-run to generate SQL without a DB connection.');
    process.exit(1);
  }

  // Dynamic import to avoid requiring the DB driver in non-DB contexts
  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(dbUrl);

  console.log('\n── Inserting figures ──────────────────────────────');
  for (const insert of inserts) {
    await sql(insert);
  }

  console.log(`\n✅ Seeded ${inserts.length} Phase 0 figures into Neon database.`);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
