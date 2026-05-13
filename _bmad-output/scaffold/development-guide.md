# Development Guide

## Prerequisites

| Tool | Version | Why |
|------|---------|-----|
| Node.js | ≥ 20.10 | api runs `tsx watch --env-file=.env` (native env-file flag) |
| pnpm | ≥ 9.0 | Workspaces; `packageManager: pnpm@9.15.0` |
| Docker | recent | Local Postgres + Redis + MailHog via `ops/docker-compose.yml` |

## One-Time Setup

```bash
# install deps for all workspaces
pnpm install

# spin up local infra (Postgres :5433, Redis :6380, MailHog :8025)
docker compose -f ops/docker-compose.yml up -d

# create the api .env (copy template)
cp apps/api/.env.example apps/api/.env
# edit JWT_SECRET, optional FF_* + OTEL_* + PAYX_*

# run migrations
pnpm --filter @shopstream/api db:migrate

# seed (~50 products, 3 demo users)
pnpm --filter @shopstream/api db:seed
```

## Demo Accounts (seeded)

| Email | Password | Notes |
|-------|----------|-------|
| `sara@shopstream.test` | `shopper123` | regular shopper, 2 orders |
| `omar@shopstream.test` | `shopper123` | new account, empty history |
| `admin@shopstream.test` | `admin123` | role: admin |

> Use these for logged-in regression checks. Guest flow must work without them.

## Day-to-Day

```bash
# run api (:4000) + web (:4200) in parallel
pnpm dev

# all tests
pnpm test

# end-to-end (Playwright)
pnpm e2e

# typecheck + lint
pnpm typecheck
pnpm lint

# format
pnpm format
pnpm format:check
```

## Focused Commands

```bash
# api — single Vitest pattern
pnpm --filter @shopstream/api test -- checkout

# web — single run, no watch
pnpm --filter @shopstream/web test --watch=false

# e2e — filtered
pnpm e2e -- --grep guest
```

## Build

```bash
pnpm build                                  # builds all workspaces
pnpm --filter @shopstream/api build         # api only → dist/server.js
pnpm --filter @shopstream/web build         # web only → apps/web/dist/
```

## Environment Variables (api)

| Var | Purpose |
|-----|---------|
| `NODE_ENV` | `development` / `production` |
| `PORT` | api port (4000) |
| `DATABASE_URL` | `postgres://shopstream:shopstream@localhost:5433/shopstream` |
| `REDIS_URL` | `redis://localhost:6380` |
| `JWT_SECRET` | ≥ 32 chars |
| `JWT_ISSUER` | `shopstream-api` |
| `FF_GUEST_CHECKOUT_ENABLED` | default `false` |
| `FF_ACCOUNT_UPSELL_AFTER_GUEST` | default `false` |
| `PAYX_API_KEY`, `PAYX_PUBLIC_KEY`, `PAYX_API_BASE` | payx sandbox |
| `OTEL_SERVICE_NAME` | OTel service identifier |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP collector (`http://localhost:4318`) |

> **Never** commit `apps/api/.env` (already in `.gitignore` via root rules).

## Payment Sandbox

`payx-sdk` defaults to sandbox. Test card:

```
4242 4242 4242 4242    any future expiry    any CVC
```

SDK tokenizes in-browser → returns `tok_test_*`. **Server must never see raw PAN.**

## Code Conventions

(See `repos/scaffold/docs/conventions.md` for full rules — summary below.)

| Topic | Rule |
|-------|------|
| API SQL location | Only inside `*.repository.ts` |
| Validation | Zod schemas at the router edge |
| Money | Integer cents + ISO `char(3)` currency |
| Web components | Standalone (no NgModules) |
| Web state | `@ngrx/signals` stores for cross-component, `signal()` for ephemeral |
| Web HTTP | Always go through `ApiService` (never raw `HttpClient`) |
| Auth on web | Interceptor attaches token; `X-Skip-Auth: 1` for guest endpoints |
| Feature flags | Snake_case env vars; default OFF |
| Commits | Conventional Commits enforced by `commitlint` + husky |

## Pre-commit Hooks

- `husky` installs hooks (`pnpm install` runs `prepare`).
- `lint-staged` runs `prettier --write` on staged `*.{ts,tsx,js,json,md,scss,html}`.
- `commitlint` enforces `@commitlint/config-conventional`.

## Testing Stack

| Surface | Runner | Watch | Notes |
|---------|--------|-------|-------|
| api | Vitest | `test:watch` | Tests under `src/**/__tests__/` |
| web | Karma + Jasmine | `test:watch` | ChromeHeadless |
| e2e | Playwright | `e2e:ui` | Specs in `e2e/tests/` |
| load | k6 | — | `ops/k6/checkout-load.js` |

## Telemetry (Local)

Web + api both export OTLP to `OTEL_EXPORTER_OTLP_ENDPOINT` (default `localhost:4318`). To view traces:
- Run a local collector + Tempo + Loki.
- See `ops/grafana/README.md` for the local stack setup.

## Useful Files

- `repos/scaffold/CLAUDE.md` — pinned context for AI agents
- `repos/scaffold/docs/conventions.md` — coding conventions (source of truth)
- `repos/scaffold/docs/design-debt.md` — known shortcomings
- `repos/scaffold/docs/feature-flags.md` — every flag + default
