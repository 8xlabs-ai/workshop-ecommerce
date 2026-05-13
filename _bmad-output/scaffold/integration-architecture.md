# Integration Architecture

> How the parts of `shopstream-checkout` communicate. Six parts, one app boundary (web ↔ api).

## Topology

```
                       Browser
                          │
                          │ HTTP/JSON (proxied /api/* in dev)
                          ▼
       ┌────────────────────────────────────────────┐
       │              apps/web (Angular 17)           │
       │  uses: shared-types, ui-{feedback,forms,layout} │
       └────────────────────────────────────────────┘
                          │
                          │  HTTP/JSON
                          ▼
       ┌────────────────────────────────────────────┐
       │             apps/api (Express + TS)           │
       │  uses: shared-types                          │
       └────────────────────────────────────────────┘
            │                │                  │
            │ pg pool        │ ioredis          │ payx-sdk
            ▼                ▼                  ▼
        Postgres 15       Redis 7        payx sandbox
                                        (browser-tokenized)
```

External egress from api: `payx-sdk` (sandbox HTTPS), OTLP collector (`http://localhost:4318` locally).

## Integration Points

| # | From | To | Mechanism | Details |
|---|------|----|-----------|---------|
| 1 | `web` | `api` | REST/JSON over HTTP | All requests go through `ApiService`. Dev: `proxy.conf.json` rewrites `/api/*` to `http://localhost:4000`. |
| 2 | `web` | `shared-types` | TS workspace import | `@shopstream/shared-types` resolved via pnpm workspace |
| 3 | `web` | `ui-feedback`, `ui-forms`, `ui-layout` | TS workspace import | `@shopstream/ui-*` resolved via pnpm workspace |
| 4 | `api` | `shared-types` | TS workspace import | Same |
| 5 | `api` | Postgres 15 | `pg` Pool | `DATABASE_URL` env; SQL only inside `*.repository.ts` |
| 6 | `api` | Redis 7 | `ioredis` | `REDIS_URL` env; backs `express-rate-limit` |
| 7 | `api` | payx sandbox | `payx-sdk` (HTTPS) | `PAYX_API_KEY`, `PAYX_PUBLIC_KEY`, `PAYX_API_BASE` |
| 8 | Browser | payx | `payx-sdk` in iframe | Tokenizes raw card → returns `tok_*` to web → web sends to api |
| 9 | payx | `api` | Webhook (HTTPS) | `POST /api/payments/webhook` — provider-signed |
| 10 | `e2e` | live `web` + `api` | Playwright drives Chromium | Run against `pnpm dev` infra |
| 11 | `testing` (MSW) | `web` component tests | In-process mock | Handlers in `libs/testing/src/handlers.ts` |
| 12 | `api` | OTLP collector | OpenTelemetry SDK | `OTEL_EXPORTER_OTLP_ENDPOINT` |
| 13 | `web` | OTLP collector | `@opentelemetry/sdk-trace-web` | Browser tracing |

## Request Lifecycle (logged-in checkout)

```
1. web: user clicks "Place order"
2. web: checkout.service → ApiService.post('/api/checkout/', body)
3. interceptors: request-id, auth.attach(JWT), no skip-auth
4. api: requestId → pino-http → helmet → cors → json
5. api: checkoutRateLimit → requireAuth → checkout.router validates with Zod
6. api: checkout.service runs business logic (txn over pg pool)
7. api: orders.repository inserts row (user_id set, guest_email NULL)
8. api: response → web → checkout.store updates → navigate to /orders/:id
```

## Request Lifecycle (guest checkout)

```
1. web: user submits guest review-step
2. web: ApiService.post('/api/checkout/guest', body) with X-Skip-Auth: 1
3. interceptors: request-id, auth.skip (no token attached)
4. api: checkoutRateLimit → checkout.router (no requireAuth)
5. api: FF check — if FF_GUEST_CHECKOUT_ENABLED=false → 403 FEATURE_DISABLED
6. api: validate via Zod → checkout.service
7. api: orders.repository inserts row (user_id NULL, guest_email populated)
8. response → web → navigate to /orders/:id
9. /orders/:id renders by GET /api/orders/:id?email=<guest_email> (optionalAuth)
```

## Cross-Cutting Concerns

| Concern | Where Lives | Crosses Parts? |
|---------|-------------|----------------|
| `X-Request-ID` | web `request-id.interceptor`, api `requestId` middleware | Yes (web → api) |
| JWT | web `auth.interceptor`, api `requireAuth`/`optionalAuth` | Yes |
| Feature flags | web `FeatureFlagsService`, api `lib/feature-flags.ts` | Yes (server is source of truth; web mirrors) |
| Money cents | `shared-types/money.ts`, `data-models orders.amount_cents` | Yes (all parts) |
| Errors | api `lib/errors.ts` → `error.interceptor` on web | Yes |

## Dependency Graph (workspace)

```
@shopstream/web ──┬──► @shopstream/shared-types
                  ├──► @shopstream/ui-feedback
                  ├──► @shopstream/ui-forms
                  └──► @shopstream/ui-layout

@shopstream/api ──► @shopstream/shared-types

@shopstream/testing ──► @shopstream/shared-types

@shopstream/e2e (no workspace deps — uses Playwright against running web+api)
```

## Failure & Retry

- Rate limits: `authRateLimit` (login/register), `checkoutRateLimit` (checkout endpoints). Redis-backed.
- Error envelope: standardized `{ error: { code, message } }`.
- Web `error.interceptor` decides toast vs redirect (e.g., 401 → /login except on `X-Skip-Auth`).
- Guest order lookup hard-requires `?email=` match — guard against enumeration.

## See Also

- [Architecture — API](./architecture-api.md)
- [Architecture — Web](./architecture-web.md)
- [API Contracts](./api-contracts-api.md)
- [Data Models](./data-models-api.md)
