# Architecture — `api` (Express + TypeScript)

> Project type: **backend** · Path: `apps/api/`

## Executive Summary

REST API backing the ShopStream storefront. Express 4 on Node 20, TypeScript 5, JWT auth, Postgres for persistence, Redis for ephemeral state, OpenTelemetry for traces/logs. Modules follow `router → service → repository` with SQL confined to repositories and Zod-validated boundaries.

## Technology Stack

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| Runtime | Node.js | ≥20.10 | Native `--env-file`, `tsx watch` |
| Framework | Express | 4.21 | Established, minimal — workshop scaffold |
| Language | TypeScript | 5.5 | Type-safety across modules |
| Validation | Zod | 3.23 | Schema-first request validation |
| DB driver | `pg` | 8.13 | Direct SQL via `Pool` |
| Migrations | `node-pg-migrate` | — | TS-based migrations (`migrations/*.ts`) |
| Cache | `ioredis` | 5.4 | Redis client (rate-limit, ephemeral) |
| Auth | `jsonwebtoken` | 9 | JWT signing/verification |
| Hashing | `bcryptjs` | 2.4 | Password hashing |
| Logging | `pino` + `pino-http` | 9 / 10 | Structured logs |
| Security | `helmet`, `cors`, `express-rate-limit` | — | Standard hardening |
| Observability | `@opentelemetry/{api,sdk-node}` | 1.9 / 0.53 | OTLP traces → Tempo, logs → Loki |
| IDs | `nanoid` | 5.0 | Short opaque IDs |
| Payments | `payx-sdk` (sandbox) | — | Server-side token verification |
| Tests | Vitest | — | Fast TS-native runner |

## Architecture Pattern

**Layered modular monolith** — vertical slices per resource.

```
src/
├── server.ts                    bootstrap (listen)
├── app.ts                       compose middleware + routers
├── config/env.ts                env validation
├── lib/                         cross-cutting (logger, errors, FF, telemetry)
├── db/pool.ts                   pg Pool singleton
├── middleware/                  request-id, auth, rate-limit, error-handler
└── modules/<resource>/
    ├── <r>.router.ts            HTTP edge (validation + status codes)
    ├── <r>.service.ts           business logic / transactions
    ├── <r>.repository.ts        SQL (only place that touches pg Pool)
    └── <r>.schemas.ts           Zod request/response shapes
```

**Rules (from `docs/conventions.md` + observed code):**
- SQL only inside `*.repository.ts`.
- Validate request bodies/queries with Zod at the router edge.
- Routers never call repositories directly — they go through services.
- Money in **integer cents** (`amount_cents`, `price_cents`).
- Currencies as ISO `char(3)`.

## Middleware Pipeline (`app.ts`)

```
request → requestId
        → pino-http (logger + request_id custom prop)
        → helmet
        → cors (origin: true, credentials: false)
        → express.json (limit: 100kb)
        → /api/health
        → /api/auth      (usersRouter)
        → /api/catalog   (catalogRouter)
        → /api/cart      (cartRouter)
        → /api/checkout  (checkoutRouter)
        → /api/orders    (ordersRouter)
        → /api/payments  (paymentsRouter)
        → errorHandler   (final)
```

## Module Inventory

| Module | Responsibility | Notable |
|--------|---------------|---------|
| `users` | Register + login (JWT issuance) | `authRateLimit` on both endpoints |
| `catalog` | Products list + detail | Public, repository-only (no service) |
| `cart` | Server-persisted cart for logged-in users | Stored by `user_id` |
| `checkout` | Order placement (logged-in + guest) | `requireAuth` for `/`, none for `/guest`; `checkoutRateLimit` on both |
| `orders` | List + by-id lookup | `requireAuth` for list, `optionalAuth` for `/:id` (guest lookup via `?email=`) |
| `payments` | Webhook + payx-sdk integration | `POST /webhook` — token verification |

## Authentication & Authorization

- **Mechanism:** JWT (`Authorization: Bearer`) signed with `JWT_SECRET`, issuer `shopstream-api`.
- **Middleware:**
  - `requireAuth` — 401 if no/invalid token.
  - `optionalAuth` — populates `req.user` if token present, otherwise no-op (used on guest order lookup).
- **Guest endpoints:** explicitly skip auth (`POST /api/checkout/guest`, `GET /api/orders/:id?email=...`).

## Rate Limiting

- `authRateLimit` → `/api/auth/login`, `/api/auth/register`.
- `checkoutRateLimit` → `/api/checkout`, `/api/checkout/guest`.
- Backed by Redis (`ioredis`) via `express-rate-limit`.

## Feature Flags

Snake_case env vars parsed in `lib/feature-flags.ts`:
- `FF_GUEST_CHECKOUT_ENABLED` (default OFF) — controls `POST /api/checkout/guest`.
- `FF_ACCOUNT_UPSELL_AFTER_GUEST` (default OFF) — controls confirmation-page banner.

When OFF, `POST /api/checkout/guest` must return `403 FEATURE_DISABLED` (per `docs/brief.md`).

## Observability

- `lib/telemetry.ts` — OTel SDK bootstrap.
- Exporter endpoint via `OTEL_EXPORTER_OTLP_ENDPOINT` (default `http://localhost:4318`).
- Service name via `OTEL_SERVICE_NAME` (default `shopstream-api`).
- Traces → Tempo. Logs → Loki via `pino`.
- Custom `withSpan(...)` helper noted in `docs/architecture.md`.

## Database

- Postgres 15 (local via `ops/docker-compose.yml` on :5433).
- Connection via `pg` Pool with `DATABASE_URL`.
- Migrations TS-based (`node-pg-migrate`, `migrations/*.ts`).
- Schema seeded by `scripts/seed.ts` (~50 products, 3 demo users).

See [Data Models](./data-models-api.md).

## Error Handling

- `lib/errors.ts` defines `AppError` taxonomy.
- Routers throw → `next(err)` → `error-handler.ts` returns JSON `{ error: { code, message } }`.
- Error log level set in `pino-http`: 5xx=error, 4xx=warn, else info.

## Testing

- Vitest (`vitest.config.ts`).
- Test files: `src/**/__tests__/*.test.ts` (currently only `checkout.schemas.test.ts`).
- Run: `pnpm --filter @shopstream/api test`.

## Source Tree (api)

See [source-tree-analysis.md → apps/api](./source-tree-analysis.md#appsapi--backend-express--ts).

## Development Workflow

See [Development Guide](./development-guide.md).

## Deployment

See [Deployment Guide](./deployment-guide.md). (No prod deployment configured in scaffold — workshop only.)
