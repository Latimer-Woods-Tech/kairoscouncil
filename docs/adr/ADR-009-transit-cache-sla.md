# ADR-009: Transit Cache SLA

**Status:** Accepted
**Date:** 2026-04-15
**Constant:** AC-009

## Context
Transit Power changes slowly (planetary movement) but must feel responsive to players. Cache staleness must not create unfair power discrepancies.

## Decision
Transit Power recalculated every 4 hours minimum. Cosmos refreshes at match start and each turn. Sub-1° transits trigger push notifications within 15 minutes. All calculations server-side.

## Consequences
- 4-hour cache window is sufficient given planetary movement rates
- Match-start recalculation ensures fresh data for competitive play
- Push notification SLA requires background job infrastructure
