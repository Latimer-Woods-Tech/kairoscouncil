# ADR-005: Attack Damage Formula

**Status:** Accepted
**Date:** 2026-04-15
**Constant:** AC-005

## Context
v2 GDD specified suppression conditions but never defined how base attack damage is calculated.

## Decision
```
Attack Damage = Transit Power × Forge Intensity × Forge Matchup Modifier
Suppression: Damage ≥ target Transit Power
Dormant threshold: TP × 0.5
```

## Consequences
- Damage scales with both astronomical conditions (TP) and event proximity (Forge Intensity)
- Forge matchup creates strategic counter-play without being dominant
- Dormant figures are easier to suppress, creating pressure to maintain Ascendant status
