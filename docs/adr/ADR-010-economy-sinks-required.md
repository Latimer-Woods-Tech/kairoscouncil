# ADR-010: Economy Sinks Required

**Status:** Accepted
**Date:** 2026-04-15
**Constant:** AC-010

## Context
TCG economies without sinks experience credit inflation, rendering currency worthless. v2 GDD specified credit sources but no sinks.

## Decision
Every credit source must have corresponding sink design. Current sinks: pack opening, 3% marketplace tax, Transit Anchor consumption, cosmetic upgrades. New credit sources require new sink documentation before implementation.

## Consequences
- Economy health is monitored — credit velocity and sink ratios tracked in PostHog
- No new credit source can be implemented without a documented sink
- The 3% marketplace tax is automatic and creates a steady drain
