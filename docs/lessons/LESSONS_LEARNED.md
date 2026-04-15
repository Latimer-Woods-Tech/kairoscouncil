# Kairos' Council — Lessons Learned
*Owned by: 🔁 LOOP GUARDIAN · Read before every session · Last updated: 2026-04-16*

## LL-001: Astronomical Engine Isolation
**Lesson:** Never import game-engine types into astronomical-engine.
**Context:** Early prototype mixed concerns, making the Meeus calculations dependent on game state.
**Rule:** astronomical-engine exports only CosmosState, TransitData, AspectData. Game engine consumes these types, never the reverse.
**Validation:** AC-001 architectural constant + validate-architecture.sh check.

## LL-002: Deterministic Seeds Are Not Optional
**Lesson:** Any non-seeded randomness in game logic destroys competitive integrity.
**Context:** Testing revealed that pack draws using Math.random() produced different results on replay.
**Rule:** Math.random() is BANNED in game-engine and astronomical-engine packages. Use the match seed via the Seed utility class.
**Validation:** ESLint rule no-restricted-properties for Math.random in those packages.

## LL-003: Neon Connection Pooling in Cloudflare Workers
**Lesson:** Cloudflare Workers require the pooled Neon connection string, not the direct connection.
**Context:** Direct connections fail in Workers environment due to TCP limitations.
**Rule:** Always use NEON_DATABASE_URL (pooled) in Workers. NEON_DATABASE_URL_UNPOOLED is for migrations and scripts only.
**Validation:** Infra checklist item in deploy runbook.

## LL-004: Lux Distortion Implementation
**Lesson:** Lux effects that completely hide values feel unfair and generate player complaints.
**Context:** Original design had Lux hiding Transit Power entirely. Playtesting showed players felt cheated.
**Rule:** Lux always shows a range (±8 for TP, ±1 for Clock). Never show nothing. See AC-008.
**Validation:** Game engine tests verify Lux responses always include a value range.

## LL-005: Stripe Webhooks Must Be Idempotent
**Lesson:** Stripe can deliver the same webhook event multiple times.
**Context:** Pack opening credited twice due to non-idempotent webhook handler.
**Rule:** All Stripe webhook handlers check for event ID in processed_events table before acting.
**Validation:** Integration test simulates duplicate webhook delivery.

## LL-006: Scaffold First, Code Second
**Lesson:** Established during Task 1 — the monorepo scaffold with types, constants, and error taxonomy defined before any implementation code ensures all packages share a common contract from day one.
**Context:** First session of Kairos' Council build.
**Rule:** Define interfaces and contracts before implementation. Types are the API.
**Validation:** TypeScript strict mode catches contract violations at compile time.

## LL-007: Test Fixtures Must Be Computed, Not Hardcoded
**Lesson:** Hardcoded JDE values in tests were wrong by 375 days (Napoleon's birth). Expected planet positions were mean heliocentric L₀ values, not geocentric.
**Context:** Task 2 — Meeus engine QA spec was written before implementation, so expected values were estimated rather than verified.
**Rule:** Any expected JDE, longitude, or position value in a test must be computed via the same formula the implementation uses, or verified against a trusted source (JPL Horizons, astro.com). Never estimate from memory.
**Rule:** Geocentric ≠ Heliocentric. Planet positions computed via Keplerian elements are heliocentric; subtracting Earth's position yields geocentric. Tests must use geocentric ranges.
**Validation:** If tests fail with large constant offsets (not rounding errors), suspect the expected value, not the implementation.

## LL-009: Database Seed Scripts Need Built Packages
**Lesson:** The database seed script imports `@kairos/astronomical-engine` to compute natal charts. This requires the astronomical-engine to be built before running the seed.
**Context:** Task 5 — `pnpm --filter @kairos/database seed` failed with module resolution errors until `pnpm --filter @kairos/astronomical-engine build` was run first.
**Rule:** When the database package references the astronomical-engine (e.g., in seed scripts), always build the astronomical-engine first. Do NOT add it as a TypeScript project reference in the database `tsconfig.json` (it would conflict with `noEmit: true` — see LL-008).
**Validation:** `pnpm --filter @kairos/astronomical-engine build && pnpm --filter @kairos/database seed:sql` runs without errors.

## LL-010: Phase 0 Roster Is Fixed
**Lesson:** The Phase 0 roster is defined in GAME_DESIGN.md and is non-negotiable until Phase 1.
**Context:** Task 5 — Initial figure selection diverged from GAME_DESIGN.md. The correct roster is: Julius Caesar, Napoleon Bonaparte, Cleopatra VII, Pythagoras, Sappho, Hannibal Barca, Hypatia, Rumi, Sun Tzu, Hildegard von Bingen.
**Rule:** Always check GAME_DESIGN.md for the canonical Phase 0 roster. Do not substitute figures without updating GAME_DESIGN.md first.
**Validation:** `PHASE_0_FIGURES` in packages/database/src/figures.ts must have exactly 10 entries matching GAME_DESIGN.md.

## LL-008: tsconfig noEmit Conflicts with Project References
**Lesson:** Setting `noEmit: true` in the root tsconfig.json conflicts with TypeScript project references — referenced projects MUST emit declarations.
**Context:** Task 2 — `tsc --noEmit` in the astronomical-engine package failed with TS6310 because the shared package inherited `noEmit: true`.
**Rule:** Packages that are referenced by other packages via `tsconfig.json references[]` must override `noEmit: false` in their own tsconfig. The root `noEmit: true` only applies to packages that don't need to emit.
**Validation:** `pnpm --filter @kairos/astronomical-engine typecheck` passes without TS6310.
