# Architecture — `shared-types`

> Project type: **library** · Path: `libs/shared-types/` · Package: `@shopstream/shared-types`

## Purpose

Single source of truth for cross-cutting domain types consumed by both `apps/api` and `apps/web`. Pure TypeScript, zero runtime.

## Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript 5.5 |
| Build | None (consumed as TS source via workspace import) |
| Tests | None |
| Lint | Not configured |

## Type Modules

| File | Exports (domain) |
|------|------------------|
| `src/address.ts` | Shipping/billing address shape |
| `src/cart.ts` | Cart + cart item types |
| `src/guest-order.ts` | Guest-order specific types (e.g., `GuestOrderLookup`) |
| `src/money.ts` | Money type (integer cents + currency code) |
| `src/order.ts` | Order types, statuses |
| `src/payment.ts` | Payment method / token types (payx) |
| `src/user.ts` | User shape, role |
| `src/index.ts` | Barrel re-export of the above |

## Consumers

- `@shopstream/api` (apps/api/package.json)
- `@shopstream/web` (apps/web/package.json)
- `@shopstream/testing` (libs/testing/package.json)

## Conventions

- No business logic, no runtime imports — types only.
- Money always represented in integer cents with explicit currency code (matches api DB schema).
- One concept per file.
