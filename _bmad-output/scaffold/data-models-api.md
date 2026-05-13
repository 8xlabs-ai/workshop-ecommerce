# Data Models — `api` (Postgres 15)

> Sourced from `apps/api/migrations/*.ts` (TS migrations via `node-pg-migrate`).

## Migration History

| File | Summary |
|------|---------|
| `1700000000000_init.ts` | Initial schema: users, products, carts, cart_items, orders |
| `1700000000001_orders_allow_guest.ts` | Relax `orders.user_id` NOT NULL, add `orders.guest_email`, add owner check, partial index |

## Tables

### `users`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | uuid | PK | `gen_random_uuid()` |
| email | text | NOT NULL, UNIQUE | — |
| password_hash | text | NOT NULL | — |
| first_name | text | NOT NULL | — |
| last_name | text | NOT NULL | — |
| role | text | NOT NULL, CHECK `IN ('shopper', 'admin')` | `'shopper'` |
| created_at | timestamptz | NOT NULL | `now()` |

### `products`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | uuid | PK | `gen_random_uuid()` |
| title | text | NOT NULL | — |
| description | text | NOT NULL | `''` |
| category | text | NOT NULL, CHECK `IN ('home', 'apparel', 'electronics')` | — |
| price_cents | integer | NOT NULL | — |
| currency | char(3) | NOT NULL | `'USD'` |
| thumbnail_url | text | NOT NULL | — |
| in_stock | integer | NOT NULL | `0` |
| created_at | timestamptz | NOT NULL | `now()` |

Indexes: `category`.

### `carts`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | uuid | PK | `gen_random_uuid()` |
| user_id | uuid | NOT NULL, UNIQUE, FK→users(id) ON DELETE CASCADE | — |
| updated_at | timestamptz | NOT NULL | `now()` |

> Server-persisted cart is per user. **No anonymous cart table — guest carts ride inline in the checkout request body.**

### `cart_items`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | uuid | PK | `gen_random_uuid()` |
| cart_id | uuid | NOT NULL, FK→carts(id) ON DELETE CASCADE | — |
| product_id | uuid | NOT NULL, FK→products(id) | — |
| quantity | integer | NOT NULL | `1` |
| variant | text | NULL | — |
| created_at | timestamptz | NOT NULL | `now()` |
| updated_at | timestamptz | NOT NULL | `now()` |

Constraints: UNIQUE (`cart_id`, `product_id`, `variant`).
Indexes: `cart_id`.

### `orders`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | uuid | PK | `gen_random_uuid()` |
| user_id | uuid | NULL (was NOT NULL pre-guest), FK→users(id) | — |
| guest_email | text | NULL | — |
| cart_snapshot | jsonb | NOT NULL | — |
| amount_cents | integer | NOT NULL | — |
| currency | char(3) | NOT NULL | `'USD'` |
| payment_ref | text | NOT NULL | — |
| shipping_addr | jsonb | NOT NULL | — |
| status | text | NOT NULL | `'placed'` |
| placed_at | timestamptz | NOT NULL | `now()` |

Check constraint: `orders_owner_check` — `(user_id IS NOT NULL) OR (guest_email IS NOT NULL)`.
Indexes:
- `user_id`
- partial: `orders.guest_email WHERE guest_email IS NOT NULL`

## Relationship Diagram

```
users  1───<  carts  1───<  cart_items  >───1  products
  │
  └───<  orders  (user_id nullable)
                 guest_email  ◀── for guest checkout (one-of constraint)
```

## Domain Decisions

(From `docs/architecture.md`)

- **Guest orders live on `orders` (nullable `user_id` + `guest_email`)** — chosen over a sibling `guest_orders` table to keep support queries single-row and joins simple. Enforced by `orders_owner_check`.
- **Cart for guests stays client-side** until checkout POST — no anonymous-cart table. Upgrade path is option 1 (cookie-keyed persistent cart) if retention asks for cart-resume-from-email.

## Money Convention

All monetary fields are integer cents (`*_cents`). Currency stored as ISO 4217 `char(3)` (default `'USD'`).

## Snapshots

`orders.cart_snapshot` and `orders.shipping_addr` are `jsonb` — order is decoupled from mutable cart/address rows.

## Migration Workflow

```bash
# create new migration
pnpm --filter @shopstream/api exec node-pg-migrate create -m migrations -j ts <name>

# apply
pnpm --filter @shopstream/api db:migrate

# rollback (local only — CI is up-only)
pnpm --filter @shopstream/api db:rollback
```
