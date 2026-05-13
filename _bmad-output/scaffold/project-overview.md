# ShopStream — Project Overview

> Generated: 2026-05-13 · Quick scan · Initial documentation

## Identity

**Name:** `shopstream-checkout`
**Description:** Mid-market consumer marketplace. Brownfield workshop scaffold for the guest-checkout slice — a 3-hour lab from 8xLabs.ai.
**Repository type:** Monorepo (pnpm workspaces)
**Primary language:** TypeScript

## Business Context

- Mid-market marketplace (home goods, apparel, small electronics)
- ~50k orders/month, three years old, growth plateaued
- Retention research: 35% of mobile cart abandons happen on the sign-in / create-account wall
- Workshop bet: enable guest checkout to lift mobile cart conversion 1.6% → 2.4% (~50% lift on ~$80M/yr GMV)

## Workshop Scope

In scope (behind `FF_GUEST_CHECKOUT_ENABLED`, default OFF):
- `POST /api/checkout/guest` (rate-limited)
- `GET /api/orders/:id?email=...` (guest-friendly lookup)
- `/checkout/guest/{contact,shipping-payment,review}` Angular flow

Out of scope: anonymous cart persistence, guest order history page, account upsell, wishlist.

## Tech Stack Summary

| Layer | Technology | Version |
|-------|------------|---------|
| Backend runtime | Node.js | 20.10+ |
| Backend framework | Express | 4.21 |
| Frontend framework | Angular (standalone) | 17.3 |
| Frontend state | NgRx Signals | 17.0 |
| Frontend UI | Angular Material | 17.3 |
| Language | TypeScript | 5.5 |
| Database | Postgres | 15 |
| Cache | Redis | 7 |
| Auth | JWT (Authorization: Bearer) | jsonwebtoken 9 |
| Validation | Zod | 3.23 |
| Logging | Pino + pino-http | 9 |
| Observability | OpenTelemetry → Grafana Tempo + Loki | sdk-node 0.53 |
| Migrations | node-pg-migrate (TS migrations) | — |
| Payments | payx-sdk (browser-tokenized sandbox) | — |
| Tests (api) | Vitest | — |
| Tests (web) | Karma + Jasmine | — |
| Tests (e2e) | Playwright | 1.47 |
| Load tests | k6 | — |
| Package manager | pnpm | 9.15 |

## Repository Parts

| Part ID | Path | Type | Purpose |
|---------|------|------|---------|
| `api` | `apps/api` | backend | Express + TS REST API |
| `web` | `apps/web` | web | Angular 17 storefront + checkout SPA |
| `ui` | `libs/ui/{feedback,forms,layout}` | library | Shared Angular UI primitives |
| `shared-types` | `libs/shared-types` | library | Cross-cutting TS types (Cart, Order, Money, Address, User, Payment) |
| `testing` | `libs/testing` | library | MSW handlers + fixture builders |
| `e2e` | `e2e` | library | Playwright specs (guest + logged-in flows) |

## Architecture at a Glance

```
Browser (Angular 17)
   │  ApiService → JSON over HTTP
   ▼
Express + TS  (router → service → repository)
   │
   ├─ pg pool ─► Postgres 15
   └─ ioredis ─► Redis 7
   │
   └─ withSpan(...) ─► OTel → Tempo + Loki
```

- Frontend talks to backend **only** through `ApiService` (interceptors: request-id, auth, error).
- Auth: JWT in `Authorization: Bearer`. Guest endpoints opt out via `X-Skip-Auth` (frontend) / no `requireAuth` (backend).
- Payments: tokenized in browser by `payx-sdk`. Server only sees `tok_test_*`. Raw card data never leaves the iframe.

## Repository Layout

```
scaffold/
├── apps/
│   ├── api/                 # Express + TS backend
│   └── web/                 # Angular 17 frontend
├── libs/
│   ├── ui/{feedback,forms,layout}  # Shared Angular primitives
│   ├── shared-types/        # Cross-app TS types
│   └── testing/             # MSW handlers + fixtures
├── e2e/                     # Playwright specs
├── ops/                     # docker-compose, grafana, k6
├── docs/                    # brief, architecture, conventions, feature-flags
└── .github/workflows/       # CI (ci.yml, security-review.yml)
```

## Documentation Links

- [Architecture — API](./architecture-api.md)
- [Architecture — Web](./architecture-web.md)
- [Architecture — UI](./architecture-ui.md)
- [Architecture — shared-types](./architecture-shared-types.md)
- [Architecture — testing](./architecture-testing.md)
- [Architecture — e2e](./architecture-e2e.md)
- [API Contracts](./api-contracts-api.md)
- [Data Models](./data-models-api.md)
- [Component Inventory — Web](./component-inventory-web.md)
- [Component Inventory — UI](./component-inventory-ui.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Development Guide](./development-guide.md)
- [Deployment Guide](./deployment-guide.md)
- [Integration Architecture](./integration-architecture.md)

### Source Project Docs (in-repo)

- `repos/scaffold/README.md`
- `repos/scaffold/CLAUDE.md`
- `repos/scaffold/docs/brief.md`
- `repos/scaffold/docs/architecture.md`
- `repos/scaffold/docs/conventions.md`
- `repos/scaffold/docs/design-debt.md`
- `repos/scaffold/docs/feature-flags.md`
- `repos/scaffold/docs/material/*.md` (Angular Material refs)
- `repos/scaffold/ops/grafana/README.md`
