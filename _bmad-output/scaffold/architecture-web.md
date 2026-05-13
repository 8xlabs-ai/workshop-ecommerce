# Architecture — `web` (Angular 17)

> Project type: **web** · Path: `apps/web/`

## Executive Summary

Customer-facing storefront and checkout SPA. Angular 17 standalone components, signal-based stores (`@ngrx/signals`), Angular Material for chrome, dev-proxied to the API. Includes both logged-in and guest checkout flows (latter feature-flagged client-side and server-side).

## Technology Stack

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| Framework | Angular (standalone) | 17.3 | No NgModules — modern Angular |
| UI | Angular Material + CDK | 17.3 | Form controls, dialogs |
| State | NgRx Signals | 17.0 | Signal-first store primitives |
| RxJS | RxJS | 7.8 | HTTP streams, signals interop |
| HTTP | Angular `HttpClient` via `ApiService` wrapper | — | Single edge for interceptors |
| Forms | Reactive Forms | — | Per `docs/architecture.md` |
| Routing | `@angular/router` | 17.3 | Code-split by feature |
| Observability | `@opentelemetry/{api,sdk-trace-web}` | 1.9 / 1.26 | Browser tracing |
| Fonts | `@fontsource/inter` | 5.0 | Self-hosted |
| Build | Angular CLI (esbuild) | 17.3 | Production builds |
| Tests | Karma + Jasmine (ChromeHeadless) | — | `pnpm --filter @shopstream/web test` |

## Architecture Pattern

**Feature-grouped standalone Angular** with shared `core/` infrastructure.

```
src/
├── main.ts                       bootstrapApplication(AppComponent, appConfig)
├── app/
│   ├── app.component.ts          shell
│   ├── app.routes.ts             top-level routes (lazy children)
│   ├── app.config.ts             providers (router, http+interceptors, i18n, MAT)
│   ├── core/                     app-wide infrastructure
│   │   ├── http/                 ApiService + interceptors
│   │   ├── auth/                 AuthService, AuthGuard
│   │   ├── feature-flags/        FeatureFlagsService, *FfEnabledDirective
│   │   ├── payments/             SavedCardsService, card-utils
│   │   ├── layout/               TopNav, Footer, Breadcrumb, AccountMenu
│   │   └── telemetry/            OTel bootstrap
│   ├── catalog/                  product listing + detail
│   ├── cart/                     cart page + signal store
│   ├── checkout/                 multi-step checkout (shell + steps + stores)
│   ├── orders/                   confirmation
│   └── account/                  login, register, dashboard, orders-list
├── styles/                       tokens, typography, breakpoints
└── environments/                 env switches (dev/prod)
```

## HTTP Layer

- **`ApiService`** (`core/http/api.service.ts`) — the only place that calls `HttpClient` directly. All features call `ApiService`.
- **Interceptors** (registered in `app.config.ts`):
  - `request-id.interceptor.ts` — generates / forwards `X-Request-ID`.
  - `auth.interceptor.ts` — attaches `Authorization: Bearer <jwt>`; respects `X-Skip-Auth` for guest endpoints.
  - `error.interceptor.ts` — central error mapping (toast / structured error events).

## Auth

- `AuthService` — token storage + observable session state.
- `AuthGuard` — protects `/account/*` routes.
- Guest checkout routes bypass `AuthGuard` and use `X-Skip-Auth` header so `auth.interceptor` won't 401-bounce.

## State Management

- `@ngrx/signals` stores:
  - `cart/cart.store.ts` — local cart state for guest + working state for logged-in.
  - `checkout/checkout.store.ts` — multi-step wizard state, draft order, selected shipping/payment.
- Component state via Angular `signal()` for ephemeral UI.

## Feature Flags

- `core/feature-flags/feature-flags.service.ts` — fetches/serves flags.
- `ff-enabled.directive.ts` — structural directive to hide guest CTAs when `guest_checkout_enabled` is OFF.

## Checkout Flow

```
/cart → /checkout (logged-in shell)
              └─ shipping-step → payment-step → review-step → place order
        /checkout/guest
              └─ guest-contact-step → guest-shipping-payment-step → guest-review-step → place order
```

- `checkout-shell.component.ts` hosts the wizard.
- `checkout.routes.ts` declares both branches; guest branch only renders when flag is enabled.
- `order-summary.component.ts` renders persistent right-rail summary.
- `saudi-cities.ts` provides KSA city autocomplete data.
- `shipping-methods.ts` enumerates shipping options.

## Routing

```
'/'                  → catalog page
'/cart'              → cart-page
'/product/:id'       → product-detail
'/checkout'          → checkout-shell (logged-in steps)
'/checkout/guest'    → guest-* steps
'/orders/:id'        → order-confirmation
'/account/*'         → AuthGuard-protected (login, register, dashboard, orders)
```

## Styling

- Global SCSS in `src/styles/` — `_tokens.scss`, `_typography.scss`, `_breakpoints.scss`, `global.scss`.
- Angular Material theme: tokens-first override (see `docs/material/*.md` for component refs).

## Build / Dev

- Dev: `ng serve --port 4200 --proxy-config proxy.conf.json` (proxies `/api/*` → `http://localhost:4000`).
- Build: `ng build --configuration production` (outputs to `dist/`).

## Testing

- Karma + Jasmine, ChromeHeadless.
- MSW available via `@shopstream/testing` for stubbing API in component tests.

## Telemetry

- `core/telemetry/telemetry.bootstrap.ts` — initializes `@opentelemetry/sdk-trace-web`.
- Traces exported to OTLP endpoint (matches api OTel config).

## Source Tree (web)

See [source-tree-analysis.md → apps/web](./source-tree-analysis.md#appsweb--frontend-angular-17-standalone).

## Component Inventory

See [Component Inventory — Web](./component-inventory-web.md).
