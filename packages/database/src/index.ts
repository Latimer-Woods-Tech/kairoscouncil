/**
 * @module @kairos/database
 * Neon Postgres schema, migrations, and queries.
 * LL-003: Always use NEON_DATABASE_URL (pooled) in Workers.
 * NEON_DATABASE_URL_UNPOOLED is for migrations and scripts only.
 */

export { PHASE_0_FIGURES } from './figures.js';
export type { FigureSeedData, FigureBirthData } from './figures.js';
