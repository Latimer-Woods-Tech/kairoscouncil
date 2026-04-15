# Kairos' Council — Lessons Learned
*Owned by: 🔁 LOOP GUARDIAN · Read before every session · Last updated: 2026-04-15*

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
