# Architecture

## High level

```
                 Browser
                    │
                 Angular 17  (apps/web)
        signals · ngrx/signals · ReactiveForms
                    │
                    │  fetch via ApiService
                    ▼
              Express 4 + TypeScript  (apps/api)
       router → service → repository (no SQL outside repos)
                    │              │
                    │              ├── pg pool ─► Postgres 15
                    │              └── ioredis ─► Redis 7
                    │
                    └── withSpan(...) ─► OTel ─► Tempo
                                              └► Loki
```

- Frontend talks to backend **only** through `ApiService`.
- Auth is JWT in `Authorization: Bearer`. Guest endpoints opt out via
  `X-Skip-Auth` (frontend) / no `requireAuth` (backend).
- Payments are tokenized in the browser by `payx-sdk`. The server
  sees `tok_*` only. Raw card data never leaves the iframe.

## Decision: where guest orders live

We considered two shapes:

1. **Nullable `user_id` + `guest_email` on `orders`.**
   Pros: one table, support queries are single-row, joins stay simple.
   Cons: the not-null constraint needs to relax, and we introduce a
   check constraint to guarantee one of them is set.
2. **Sibling `guest_orders` table.**
   Pros: keeps the strict not-null on `orders.user_id`.
   Cons: every order-reading code path has to union two tables;
   support tooling fragments.

We picked **option 1**. The check constraint
`(user_id IS NOT NULL) OR (guest_email IS NOT NULL)` enforces "one
owner" without complicating reads.

See migration
`apps/api/migrations/1700000000001_orders_allow_guest.ts`.

## Decision: where the guest cart lives

We considered three shapes:

1. **Persistent anonymous cart** keyed by an HTTP-only cookie.
2. **Client-only cart** in `localStorage`, sent on checkout.
3. **No cart persistence** — cart lives in the checkout request body.

We picked **option 3** for this slice. The shopper's cart-page state
is already client-side until they hit checkout, so we accept the cart
items inline in `POST /api/checkout/guest`. If retention asks for
cart-resume-from-email later, option 1 is the upgrade path.

## Server layering

```
modules/<name>/
├── <name>.router.ts        # mounted in app.ts; thin HTTP layer
├── <name>.service.ts       # business logic; pure-ish
├── <name>.repository.ts    # SQL — the ONLY place pg is touched
├── <name>.schemas.ts       # zod schemas for every request shape
└── __tests__/              # vitest
```

- Routers do **only** validation + service call + response shaping.
- Services compose repositories; no HTTP details leak in.
- Repositories own SQL. No raw SQL anywhere else.

## Frontend layering

```
apps/web/src/app/
├── app.routes.ts
├── core/
│   ├── auth/        # AuthService, authGuard, interceptors
│   ├── http/        # ApiService, interceptors (auth, request-id, error)
│   ├── feature-flags/  # FeatureFlagsService, *ffEnabled
│   └── layout/      # TopNav, AppFooter, Breadcrumb
├── checkout/
│   ├── checkout.routes.ts
│   ├── checkout-shell.component.ts
│   ├── checkout.store.ts          # ngrx/signals
│   ├── checkout.service.ts
│   ├── order-summary.component.ts
│   └── steps/                     # 4 logged-in + 3 guest steps
├── cart/
├── catalog/
├── orders/
└── account/
```

- Standalone components only. No NgModules in new code.
- State: signals for local; `@ngrx/signals` for cross-component.
- Forms: Reactive only. Always wrap inputs in `<ss-form-field>`.
- HTTP: always via `ApiService`.

## Feature-flag flow

Server side:

```ts
if (!featureFlags.isEnabled('guest_checkout_enabled', { ip })) {
  throw new FeatureDisabledError('guest_checkout_enabled');
}
```

Client side:

```html
<a *ffEnabled="'guest_checkout_enabled'" routerLink="/checkout/guest/contact">
  Continue as guest
</a>
```

Flags default OFF. Reload via `SIGHUP` on the API process.

## Observability

- Every external call wrapped in `withSpan('name', span => ...)`.
- Each request gets an `x-request-id` and pino logs include it.
- Frontend trace propagation is **not yet** wired (known gap in
  `CLAUDE.md`).
