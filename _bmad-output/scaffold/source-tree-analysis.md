# Source Tree Analysis

> Quick-scan source tree with annotations. Sourced from glob/ls — no source body reading except entry points.

## Top-level Structure

```
scaffold/
├── apps/                       # Deployable applications
│   ├── api/                    # Express + TS backend  (Part: api)
│   └── web/                    # Angular 17 frontend   (Part: web)
├── libs/                       # Internal workspace libraries
│   ├── shared-types/           # Cross-app TS types    (Part: shared-types)
│   ├── testing/                # MSW + fixtures        (Part: testing)
│   └── ui/                     # Angular UI primitives (Part: ui)
│       ├── feedback/
│       ├── forms/
│       └── layout/
├── e2e/                        # Playwright specs       (Part: e2e)
├── ops/                        # Dev infra (docker-compose, k6, grafana)
├── docs/                       # In-repo workshop docs
├── _screens/                   # Design screenshots/refs
├── .github/workflows/          # CI pipelines
├── package.json                # Root manifest (workspace scripts)
├── pnpm-workspace.yaml         # Workspace package globs
├── tsconfig.base.json          # Shared TS config
├── README.md
└── CLAUDE.md                   # Pinned context for Claude Code
```

## apps/api — Backend (Express + TS)

```
apps/api/
├── package.json                # @shopstream/api
├── tsconfig.json, tsconfig.build.json
├── vitest.config.ts            # Test runner config
├── .env / .env.example         # Env (DATABASE_URL, REDIS_URL, JWT_SECRET, FF_*, PAYX_*)
├── migrations/                 # node-pg-migrate TS migrations
│   ├── 1700000000000_init.ts          # users, products, carts, cart_items, orders
│   └── 1700000000001_orders_allow_guest.ts   # orders.user_id nullable + guest_email
├── scripts/
│   └── seed.ts                 # Seeds ~50 products, 3 demo users
└── src/
    ├── server.ts               # ENTRY: listens on PORT
    ├── app.ts                  # createApp(): wires middleware + routers
    ├── config/
    │   └── env.ts              # Env parsing/validation
    ├── lib/
    │   ├── logger.ts           # Pino logger
    │   ├── errors.ts           # AppError taxonomy
    │   ├── feature-flags.ts    # FF_* parsing
    │   └── telemetry.ts        # OTel bootstrap (withSpan helper)
    ├── db/
    │   └── pool.ts             # pg Pool (DATABASE_URL)
    ├── middleware/
    │   ├── request-id.ts       # X-Request-ID
    │   ├── error-handler.ts    # Final error → JSON
    │   ├── rate-limit.ts       # checkoutRateLimit, authRateLimit
    │   └── auth.ts             # requireAuth, optionalAuth (JWT)
    ├── types/                  # API-local types
    └── modules/                # Vertical slice per resource
        ├── users/              # auth: login + register
        │   ├── users.router.ts
        │   ├── users.service.ts
        │   ├── users.repository.ts
        │   └── users.schemas.ts (Zod)
        ├── catalog/            # products list + detail (public)
        │   ├── catalog.router.ts
        │   ├── catalog.repository.ts
        │   └── catalog.schemas.ts
        ├── cart/               # logged-in cart (server-persisted)
        │   ├── cart.router.ts
        │   ├── cart.service.ts
        │   ├── cart.repository.ts
        │   └── cart.schemas.ts
        ├── checkout/           # POST /api/checkout + POST /api/checkout/guest
        │   ├── checkout.router.ts
        │   ├── checkout.service.ts
        │   ├── checkout.schemas.ts
        │   └── __tests__/checkout.schemas.test.ts
        ├── orders/             # GET /api/orders, GET /api/orders/:id (optionalAuth)
        │   ├── orders.router.ts
        │   ├── orders.repository.ts
        │   └── orders.schemas.ts
        └── payments/           # payx-sdk integration + webhook
            ├── payments.router.ts
            ├── payments.schemas.ts
            └── payx-client.ts
```

**Pattern:** `router → service → repository`. SQL stays inside `*.repository.ts`. Each module owns Zod schemas in `*.schemas.ts`.

## apps/web — Frontend (Angular 17 standalone)

```
apps/web/
├── package.json                # @shopstream/web
├── angular.json                # Angular workspace config
├── proxy.conf.json             # Dev proxy to api on :4000
├── karma.conf.js               # Karma + Jasmine
├── tsconfig.{json,app,spec}.json
└── src/
    ├── main.ts                 # ENTRY: bootstrapApplication
    ├── index.html
    ├── environments/{environment,environment.production}.ts
    ├── styles/                 # Global SCSS (tokens, typography, breakpoints)
    └── app/
        ├── app.component.ts
        ├── app.routes.ts       # Top-level routes
        ├── app.config.ts       # Providers (HttpClient + interceptors, router)
        ├── core/
        │   ├── http/           # ApiService + interceptors (request-id, auth, error)
        │   ├── auth/           # AuthService + AuthGuard
        │   ├── feature-flags/  # FeatureFlagsService + ff-enabled directive
        │   ├── layout/         # TopNav, Footer, Breadcrumb, AccountMenu, icons
        │   ├── payments/       # SavedCardsService, card-utils, card.types
        │   └── telemetry/      # OTel bootstrap (web tracer)
        ├── catalog/            # catalog-page + product-detail components
        ├── cart/               # cart-page + cart.service + cart.store (signals)
        ├── checkout/           # Multi-step checkout (logged-in + guest)
        │   ├── checkout-shell.component.ts
        │   ├── checkout.routes.ts
        │   ├── checkout.service.ts
        │   ├── checkout.store.ts        # ngrx/signals
        │   ├── order-summary.component.ts
        │   ├── shipping-methods.ts
        │   ├── saudi-cities.ts
        │   └── steps/
        │       ├── shipping-step.component.ts
        │       ├── payment-step.component.ts
        │       ├── review-step.component.ts
        │       ├── guest-contact-step.component.ts
        │       ├── guest-shipping-payment-step.component.ts
        │       └── guest-review-step.component.ts
        ├── orders/             # order-confirmation
        └── account/            # login, register, dashboard, orders-list
```

**Patterns:**
- Standalone components only (no NgModules).
- State via `@ngrx/signals` stores (`cart.store.ts`, `checkout.store.ts`).
- HTTP via `ApiService`; interceptors handle auth/request-id/errors.
- Guest flow is parallel route tree under `checkout/steps/guest-*.component.ts`.

## libs/ui — UI primitives (3 packages)

```
libs/ui/
├── feedback/                   # @shopstream/ui-feedback
│   └── src/
│       ├── inline-banner.component.ts
│       ├── toast.service.ts
│       └── index.ts
├── forms/                      # @shopstream/ui-forms
│   └── src/
│       ├── button.component.ts
│       ├── text-input.component.ts
│       ├── select.component.ts
│       ├── checkbox.component.ts
│       ├── radio.component.ts
│       ├── radio-card.component.ts
│       ├── form-field.component.ts
│       ├── error-summary.component.ts
│       ├── quantity-stepper.component.ts
│       └── index.ts
└── layout/                     # @shopstream/ui-layout
    └── src/
        ├── app-shell.component.ts
        ├── page-header.component.ts
        ├── empty-state.component.ts
        └── index.ts
```

## libs/shared-types — Cross-app TS types

```
libs/shared-types/src/
├── address.ts
├── cart.ts
├── guest-order.ts
├── money.ts
├── order.ts
├── payment.ts
├── user.ts
└── index.ts          # Barrel export
```

## libs/testing — Test fixtures + MSW

```
libs/testing/src/
├── fixtures.ts       # Builders for cart, order, address, etc.
├── handlers.ts       # MSW request handlers (mocks the api surface)
└── index.ts
```

## e2e — Playwright

```
e2e/
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── tests/
    ├── guest-checkout.spec.ts
    └── logged-in-checkout.spec.ts
```

## ops — Dev infrastructure

```
ops/
├── docker-compose.yml          # Postgres 15 (:5433), Redis 7 (:6380), MailHog
├── grafana/
│   └── README.md               # Tempo + Loki setup
└── k6/
    └── checkout-load.js        # Load test for checkout endpoint
```

## .github/workflows — CI

```
.github/workflows/
├── ci.yml                      # Build + typecheck + test + e2e
└── security-review.yml         # Security scan workflow
```

## Critical Folders Summary

| Folder | Purpose | Entry Point |
|--------|---------|-------------|
| `apps/api/src/modules/` | Vertical-slice modules (router/service/repo/schemas) | `app.ts` mounts each router |
| `apps/api/src/middleware/` | Cross-cutting concerns | wired in `createApp()` |
| `apps/api/migrations/` | DB schema evolution | `pnpm --filter @shopstream/api db:migrate` |
| `apps/web/src/app/core/` | App-wide services + interceptors | `app.config.ts` providers |
| `apps/web/src/app/checkout/` | Multi-step checkout flow | `checkout.routes.ts` |
| `libs/shared-types/` | Cross-cutting contracts | `src/index.ts` barrel |
| `e2e/tests/` | End-to-end specs | `playwright.config.ts` |
| `ops/` | Local dev infra | `docker-compose.yml` |

## Integration Surface

| From | To | Mechanism |
|------|-----|-----------|
| `web` | `api` | HTTP/JSON via `ApiService` (proxied in dev via `proxy.conf.json`) |
| `web` | `shared-types` | TS workspace import |
| `web` | `ui-{feedback,forms,layout}` | TS workspace import |
| `api` | `shared-types` | TS workspace import |
| `api` | Postgres | `pg` Pool (DATABASE_URL) |
| `api` | Redis | `ioredis` (REDIS_URL) |
| `api` | payx | `payx-sdk` over HTTPS (PAYX_API_BASE) |
| `e2e` | `web` + `api` (live) | Playwright drives browser |
| `testing` | (consumers) | MSW handlers used by web component tests |
