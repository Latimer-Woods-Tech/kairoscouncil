# Kairos' Council — Deployment Runbook
*Owned by: 📡 INFRA · Last updated: 2026-04-15*

## Pre-Deployment Checklist
- [ ] All CI checks pass (typecheck, lint, test, validate:arch)
- [ ] LESSONS_LEARNED.md reviewed for deployment-related lessons
- [ ] LL-003: Confirm Workers use NEON_DATABASE_URL (pooled), not UNPOOLED
- [ ] No secrets in wrangler.toml or committed to repository
- [ ] Database migrations applied to target environment

## Staging Deployment
Automatic on merge to `main` via `deploy-staging.yml`.

## Production Deployment
Manual trigger via `deploy-prod.yml` (workflow_dispatch).
Requires environment approval.

## Secrets (configured in Cloudflare via `wrangler secret put`)
- `NEON_DATABASE_URL` — pooled connection string
- `JWT_SECRET` — JWT signing key
- `ENCRYPTION_KEY` — data encryption key
- `STRIPE_SECRET_KEY` — Stripe API secret
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret

## Rollback Procedure
1. Identify failing deployment in Cloudflare dashboard
2. Roll back to previous version via `wrangler rollback`
3. Document incident in LESSONS_LEARNED.md
