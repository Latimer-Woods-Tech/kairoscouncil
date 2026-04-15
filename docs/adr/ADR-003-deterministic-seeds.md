# ADR-003: Deterministic Seeds

**Status:** Accepted
**Date:** 2026-04-15
**Constant:** AC-003

## Context
Competitive integrity requires that all matches be reproducible. Square bond 30% misfire, Unstable Sky randomization, and pack draws must produce the same results on replay.

## Decision
Every match is locked to a `timestamp+seed` at initiation. All probabilistic elements use this seed via a deterministic PRNG. `Math.random()` is banned in game-engine and astronomical-engine.

## Consequences
- Matches are fully reproducible for debugging and dispute resolution
- ESLint enforces `no-restricted-properties` for `Math.random` in core packages
- A `Seed` utility class provides the seeded PRNG interface
- Pack draws outside matches use server-generated seeds, also stored for auditability
