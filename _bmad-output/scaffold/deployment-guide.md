# Deployment Guide

> **Scope:** Workshop scaffold. No production deployment configuration is checked into the repo. CI runs build + tests, not deploys. Below documents what _is_ wired today and what would need to be added.

## What Ships in the Repo

| Path | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Pull-request build + typecheck + tests + Playwright |
| `.github/workflows/security-review.yml` | Security scan workflow |
| `ops/docker-compose.yml` | **Local dev only** — Postgres 15, Redis 7, MailHog |
| `ops/grafana/README.md` | Local Grafana + Tempo + Loki notes |
| `ops/k6/checkout-load.js` | k6 load script for the checkout endpoint |

> **No Dockerfile for api or web.** **No Kubernetes / Helm / Terraform.** **No deploy job in workflows.** If you ship this to prod, you need to add them.

## Local "Production-like" Run

```bash
# build everything
pnpm build

# run api off compiled dist
node apps/api/dist/server.js          # respects same .env vars

# serve web build output
# pnpm --filter @shopstream/web build → outputs to apps/web/dist/
# serve via any static host (nginx, caddy, etc.)
```

## CI (existing)

`.github/workflows/ci.yml` is the only CI present. Per workshop conventions:
- runs on PR.
- typecheck + lint + Vitest + Karma + Playwright.
- **Migrations are up-only in CI** — `db:rollback` is local-only (see `docs/conventions.md` note in the guest migration: "CI is up-only — exercise locally before relying on it").

## Environments

| Env | Status | Notes |
|-----|--------|-------|
| Local dev | ✅ ready | `pnpm dev` + `docker compose` |
| Staging | ❌ not configured | Need: build image, env secrets, OTLP endpoint |
| Production | ❌ not configured | Same |

## What a Real Deploy Would Need (Not in Repo)

1. **Dockerfile (api)** — multi-stage: install → build → copy `dist/` + `node_modules` → `CMD node dist/server.js`.
2. **Dockerfile (web)** — build with Angular CLI → serve `dist/` from nginx.
3. **Secret management** — `JWT_SECRET`, `DATABASE_URL`, `REDIS_URL`, `PAYX_API_KEY`, OTel endpoint.
4. **Migration step** — `pnpm --filter @shopstream/api db:migrate` against target DB before rolling api.
5. **Health check** — `GET /api/health` already exists; wire to load balancer.
6. **Observability** — point `OTEL_EXPORTER_OTLP_ENDPOINT` at the prod collector; set `OTEL_SERVICE_NAME` per env.
7. **Feature-flag flip** — staging gets `FF_GUEST_CHECKOUT_ENABLED=true` for the 5%-mobile rollout (per `docs/brief.md`).

## Local Infra Quick Reference

| Service | Container | Host Port | URL |
|---------|-----------|-----------|-----|
| Postgres 15 | `shopstream-postgres` | 5433 | `postgres://shopstream:shopstream@localhost:5433/shopstream` |
| Redis 7 | `shopstream-redis` | 6380 | `redis://localhost:6380` |
| MailHog SMTP | `shopstream-mailhog` | 1025 | smtp://localhost:1025 |
| MailHog UI | `shopstream-mailhog` | 8025 | http://localhost:8025 |

## Load Testing

```bash
# k6 load against local api
k6 run ops/k6/checkout-load.js
```

## Observability Setup (local)

See `repos/scaffold/ops/grafana/README.md` for the Tempo + Loki stack. The api and web both auto-export to `OTEL_EXPORTER_OTLP_ENDPOINT` (default `http://localhost:4318`).
