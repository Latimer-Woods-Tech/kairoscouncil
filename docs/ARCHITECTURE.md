# Kairos' Council — Architecture Document
*Owned by: 🏛️ ARCHITECT · Living document · Last updated: 2026-04-15*

## Overview

Kairos' Council is a mobile-first living card game where card power is calculated from real planetary positions using Jean Meeus astronomical algorithms. The architecture enforces separation between astronomical truth and game balance, server-side authority, and deterministic reproducibility.

## Architectural Constants

### AC-001: Two-Layer Astronomical Architecture
The Meeus engine (Core Layer) is NEVER modified for balance. All balance tuning happens exclusively in the Event Mapper. These two layers are separated by an explicit interface boundary with typed contracts (`CosmosState`, `TransitData`, `AspectData`).

**Packages:** `@kairos/astronomical-engine/core` → `@kairos/astronomical-engine/event-mapper`
**Boundary type:** `CosmosState`

### AC-002: Server-Side Authority
All game state is authoritative server-side. The client (`@kairos/web`) is a display layer only. Clients receive calculated values — never raw ephemeris data, never unvalidated game state. Any client-side calculation that affects game outcomes is a **critical bug**.

### AC-003: Deterministic Seeds
Every match is locked to a `timestamp+seed` at initiation. All probabilistic elements use this seed. Matches must be fully reproducible. Any use of `Math.random()` in `@kairos/game-engine` or `@kairos/astronomical-engine` is a **critical bug**.

### AC-004: Transit Power Formula
```
Transit Power = Base Floor (40) + Transit Bonus + Aspect Bonus + Dignity Bonus
Transit Bonus = Sum of (Exactness Score × Aspect Weight) for all active transits
Exactness Score: 10 at exact (0° orb) → 0 at 3° orb (linear decay)
Weights: Conjunction 3.0× | Opposition 2.0× | Trine 1.8× | Square 1.5× | Sextile 1.2×
Aspect Bonus: 0–20 (natal aspects active on battlefield)
Dignity Bonus: +10 domicile/exaltation | −5 detriment/fall
Retrograde: Transit Bonus halved | Aether Forge Intensity ×2
Solar Return: Within 7 days → automatic Ascendant status
Range: 40 (floor) → 100 (ceiling)
```

### AC-005: Attack Damage Formula
```
Attack Damage = Transit Power × Forge Intensity × Forge Matchup Modifier
Forge Intensity: 1 = ruling planet >5° | 2 = within 5° | 3 = within 1° or named event
Forge Matchup: Strong 1.1× | Neutral 1.0× | Weak 0.9×
Suppression: Damage ≥ target Transit Power (Dormant threshold: TP × 0.5)
```

### AC-006: Forge Interaction Matrix
```
              CHRONOS   EROS    AETHER   LUX     PHOENIX
CHRONOS att:    —      neutral  neutral  WEAK    STRONG
EROS att:      WEAK      —      STRONG  neutral  neutral
AETHER att:   neutral   WEAK      —     STRONG   neutral
LUX att:      STRONG   neutral  neutral    —      WEAK
PHOENIX att:  neutral   STRONG   WEAK   neutral    —
```

### AC-007: Celestial Energy Economy
```
Base: 3 CE/turn | Carryover: max 1 | Event bonus: +1 per active event | Max: 7
Summon cost: Forge Intensity (1–3) | Chronos delay: 2 CE | Bond activation: FREE
```

### AC-008: Lux Distortion (Never Removal)
Lux effects always distort, never remove. TP shows as range (±8), Clock shows as range (±1), Forecast shows mood not event name, Forge Intensity shows descriptor not number.

### AC-009: Transit Cache SLA
Transit Power recalculated every 4 hours minimum. Cosmos refreshes at match start and each turn. Sub-1° transits trigger push notifications within 15 minutes. All calculations server-side.

### AC-010: Economy Sinks Required
Every credit source must have corresponding sink design. Current sinks: pack opening, 3% marketplace tax, Transit Anchor consumption, cosmetic upgrades.

## Technology Stack

| Layer | Technology | Package |
|-------|-----------|---------|
| Astronomical Engine | Jean Meeus algorithms | `@kairos/astronomical-engine` |
| Game Logic | TypeScript | `@kairos/game-engine` |
| API | Cloudflare Workers | `@kairos/api` |
| Real-Time | Durable Objects + WebSockets | `@kairos/api` |
| Database | Neon Postgres (serverless) | `@kairos/database` |
| Payments | Stripe | `@kairos/api` |
| Client | PWA (Phase 0–3) | `@kairos/web` |
| Shared Types | TypeScript interfaces | `@kairos/shared` |

## Package Dependency Graph
```
@kairos/shared (types, constants, errors)
  ↑ consumed by all packages

@kairos/astronomical-engine
  ↑ depends on: @kairos/shared
  ↑ exports: CosmosState, TransitData, AspectData
  ✗ NEVER imports from @kairos/game-engine (AC-001)

@kairos/game-engine
  ↑ depends on: @kairos/shared
  ↑ consumes astronomical output types
  ✗ NEVER imports @kairos/astronomical-engine internals (AC-001)

@kairos/database
  ↑ depends on: @kairos/shared

@kairos/api
  ↑ depends on: all packages
  ↑ orchestrates astronomical + game + database

@kairos/web
  ↑ depends on: @kairos/shared (types only)
  ✗ NEVER performs game calculations (AC-002)
```
