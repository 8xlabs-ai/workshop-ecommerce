# API Contracts — `api`

> Source: glob-based extraction from `apps/api/src/modules/*/*.router.ts` + `app.ts` mounts. Quick scan — request/response shapes summarized from Zod schemas (in `*.schemas.ts`) and module names; not exhaustively read.

## Base URL

- Dev: `http://localhost:4000` (web proxies `/api/*`)
- Mount prefix: all routes under `/api`

## Cross-cutting Headers

- `Authorization: Bearer <jwt>` — required when behind `requireAuth`.
- `X-Skip-Auth: 1` (web only) — instructs `auth.interceptor` to skip attaching the token. Used for guest endpoints.
- `X-Request-ID` — generated/forwarded by `requestId` middleware. Echoed in logs.

## Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | none | `{ status: 'ok', uptime: number }` |

## `/api/auth` (users.router)

| Method | Path | Auth | Rate-limit | Body | Returns |
|--------|------|------|-----------|------|---------|
| POST | `/api/auth/register` | none | `authRateLimit` | `users.schemas` register | JWT + user |
| POST | `/api/auth/login` | none | `authRateLimit` | `{ email, password }` | JWT + user |

## `/api/catalog` (catalog.router)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/catalog/products` | none | Product list. Likely filters: category, search (verify in `catalog.schemas.ts`). |
| GET | `/api/catalog/products/:id` | none | Product detail by uuid. |

## `/api/cart` (cart.router)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/cart/` | implicit user (router-level) | Current user's cart |
| POST | `/api/cart/items` | implicit user | Add item to cart |
| PATCH | `/api/cart/items/:id` | implicit user | Update quantity / variant |

> Note: cart endpoints rely on session/user context — `requireAuth` not visible in router-level handler text, but server-persisted cart in `carts` table is keyed by `user_id` (NOT NULL, UNIQUE).

## `/api/checkout` (checkout.router)

| Method | Path | Auth | Rate-limit | Description |
|--------|------|------|-----------|-------------|
| POST | `/api/checkout/` | `requireAuth` | `checkoutRateLimit` | Logged-in checkout. Body validated via `checkout.schemas.ts`. |
| POST | `/api/checkout/guest` | none (feature-flagged) | `checkoutRateLimit` | Guest checkout. Returns `403 FEATURE_DISABLED` when `FF_GUEST_CHECKOUT_ENABLED=false`. Body includes cart items + email + shipping + payment token. |

## `/api/orders` (orders.router)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/orders/` | `requireAuth` | Authenticated user's orders |
| GET | `/api/orders/:id` | `optionalAuth` | Order detail. Guest lookup requires `?email=<guest_email>`. Auth user lookup matches by `user_id`. |

## `/api/payments` (payments.router)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/payments/webhook` | provider-signed | payx-sdk webhook receiver — payment state updates |

## Error Envelope

Defined by `lib/errors.ts` + `middleware/error-handler.ts`:

```json
{ "error": { "code": "<MACHINE_CODE>", "message": "<human readable>" } }
```

Status-code mapping (from `pino-http.customLogLevel`):
- `4xx` — client error (warn-logged)
- `5xx` — server error (error-logged)

Known machine codes (partial — confirm in `lib/errors.ts`):
- `FEATURE_DISABLED` — guest checkout when flag OFF
- (others — extract from `errors.ts` for full taxonomy)

## Validation

Every request body / query is parsed through Zod (`*.schemas.ts`). Routers throw 400 with field-level details on failure.

## Cross-References

- Demo accounts (seeded): `sara@shopstream.test / shopper123`, `omar@shopstream.test / shopper123`, `admin@shopstream.test / admin123`.
- Payment sandbox: card `4242 4242 4242 4242`, any future expiry, any CVC. Server only sees `tok_test_*`.

## Out-of-Scope (Workshop)

- Anonymous-cart persistence — cart accepted inline in `POST /api/checkout/guest`.
- Guest order history list — guests look up by id + email only.
