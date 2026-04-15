# ADR-002: Server-Side Authority

**Status:** Accepted
**Date:** 2026-04-15
**Constant:** AC-002

## Context
Card games are high-value cheating targets. If clients can calculate or mutate game state, exploits are inevitable.

## Decision
All game state is authoritative server-side. The client is a display layer only. Clients receive calculated values — never raw ephemeris data, never unvalidated game state.

## Consequences
- All game logic runs in Cloudflare Workers / Durable Objects
- Client never receives raw astronomical data
- Any client-side calculation affecting game outcomes is a critical bug
- Higher latency tolerance required — mitigated by WebSocket Durable Objects
