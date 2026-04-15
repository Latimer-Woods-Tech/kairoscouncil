# Kairos' Council — Security Document
*Owned by: 🛡️ SECURITY · Living document · Last updated: 2026-04-15*

## Threat Model

### Primary Threats

| # | Threat | Mitigation | Status |
|---|--------|-----------|--------|
| 1 | Match state manipulation | AC-002: Server-side authority | Architectural |
| 2 | Transit Power spoofing | Server-side calculation only | Architectural |
| 3 | Seed exploitation | Seed never exposed to client | Architectural |
| 4 | Economy manipulation | Stripe webhook validation + server ledger | Implementation (Task 12) |
| 5 | API abuse | Rate limiting per IP + per user | Implementation (Task 12) |
| 6 | Durable Object state corruption | Optimistic locking + event sourcing | Implementation (Task 12) |

### Authentication
- JWT with 15-minute access tokens + 7-day refresh tokens
- Tokens stored in httpOnly cookies (not localStorage)
- All match actions require valid session + match participant validation

### Rate Limiting
```typescript
auth:        10 requests / 1 minute
matchAction: 60 requests / 1 minute (1/sec during match)
packOpen:     5 requests / 1 minute
api:        300 requests / 1 minute
```

### Input Validation
- All inputs validated with Zod schemas before processing
- No raw SQL — parameterized queries only via Drizzle ORM
- Stripe webhook signature verification on all webhook endpoints

### Secrets Management
- All secrets stored in GitHub Secrets / Cloudflare Secrets
- Never committed to repository
- `.env` files are `.gitignored`
- `wrangler.toml` contains no secrets

### Security Review Log

| Date | Task | Surface | Mitigation | Reviewer |
|------|------|---------|------------|----------|
| 2026-04-15 | Task 1: Scaffold | .env gitignored, no secrets in wrangler.toml, CODEOWNERS gates main | Baseline — no novel threats | 🛡️ SECURITY |
