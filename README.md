# Kairos' Council

**A living card game where real astronomical data governs card power.**

*"Timing is everything."*

---

## Overview

Kairos' Council is a mobile-first living card game where players assemble councils of historical figures — calculated using real astronomical data via the Jean Meeus algorithms — and compete using a power system governed by actual planetary transits.

Card power is not arbitrary. It is calculated from real planetary positions, publicly verifiable, constantly changing.

## Project Structure

```
packages/
  shared/                 # Types, constants, error taxonomy
  astronomical-engine/    # Jean Meeus calculations + Event Mapper
  game-engine/            # Match logic, combat, bonds, bursts
  database/               # Neon Postgres schema & migrations
apps/
  api/                    # Cloudflare Workers API
  web/                    # PWA client
```

## Tech Stack

- **API/Game Logic:** Cloudflare Workers (TypeScript)
- **Real-time:** Cloudflare Durable Objects + WebSockets
- **Database:** Neon Postgres (serverless)
- **Payments:** Stripe
- **Client:** PWA (Phase 0–3), React Native (Phase 4)
- **Astronomical Engine:** Jean Meeus algorithms

## Getting Started

```bash
# Install CLIs
bash scripts/setup.sh

# Install dependencies
pnpm install

# Run tests
pnpm test

# Validate architecture
pnpm validate:arch
```

## Current Phase

**Phase 0** — Port Meeus Engine → Generate 10 Cards → Local 2-Player Transit Match

**Success gate:** 1 human says "wait, this power is REAL?" and means it.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Security](docs/SECURITY.md)
- [Game Design](docs/GAME_DESIGN.md)
- [Lessons Learned](docs/lessons/LESSONS_LEARNED.md)
- [Deployment Runbook](docs/RUNBOOK.md)
- [ADRs](docs/adr/)

---

*Kairos' Council · kairoscouncil.com · The Factory · Confidential*