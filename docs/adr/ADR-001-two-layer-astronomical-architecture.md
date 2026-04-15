# ADR-001: Two-Layer Astronomical Architecture

**Status:** Accepted
**Date:** 2026-04-15
**Constant:** AC-001

## Context
The Jean Meeus astronomical engine produces real ephemeris data. Game balance requires tuning multipliers and thresholds. If balance changes touch the Meeus calculations, astronomical accuracy is compromised and the core thesis ("this power is REAL") collapses.

## Decision
Separate the system into two layers:
1. **Core Layer** — Pure Meeus calculations. Never modified for balance.
2. **Event Mapper** — Translates raw data into named game states. All balance tuning here.

These layers are separated by typed contracts (`CosmosState`, `TransitData`, `AspectData`).

## Consequences
- Balance changes never touch astronomical accuracy
- The Event Mapper is the only place where orb thresholds, Forge Intensity assignments, and named event triggers are defined
- `@kairos/astronomical-engine` must never import from `@kairos/game-engine`
- Validated by `validate-architecture.sh`
