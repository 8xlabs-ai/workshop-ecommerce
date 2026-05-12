# ShopStream

Mid-market consumer marketplace. Brownfield workshop scaffold for the
guest-checkout slice — a 3-hour lab from 8xLabs.ai.

## Stack

| Layer | Technology |
| --- | --- |
| Backend | Node.js 20 · Express 4 · TypeScript 5 |
| Frontend | Angular 17 (standalone components) |
| Database | Postgres 15 |
| Cache | Redis 7 |
| Auth | JWT (`Authorization: Bearer`) |
| Payments | `payx-sdk` (browser-tokenized) |
| Tests | Vitest (api) · Karma + Jasmine (web) · Playwright (e2e) |
| Package manager | pnpm 9 · workspaces |
| Observability | OpenTelemetry → Grafana Tempo + Loki |

## Quickstart

```bash
# one-time setup
pnpm install
docker compose -f ops/docker-compose.yml up -d   # Postgres, Redis, mailhog
pnpm --filter @shopstream/api db:migrate
pnpm --filter @shopstream/api db:seed            # ~50 products, 3 demo users

# day-to-day
pnpm dev                                          # api on :4000, web on :4200
pnpm test                                         # all tests
pnpm e2e                                          # Playwright

# focused
pnpm --filter @shopstream/api test -- checkout
pnpm --filter @shopstream/web test --watch=false
pnpm e2e -- --grep guest
```

## Demo accounts (seeded)

| Email | Password | Notes |
| --- | --- | --- |
| sara@shopstream.test | shopper123 | regular shopper, 2 orders |
| omar@shopstream.test | shopper123 | new account, empty history |
| admin@shopstream.test | admin123 | has the `admin` role |

> These are for logged-in regression checks. Your **guest** flow must
> work without any of them.

## Payment sandbox

`payx-sdk` is wired to its sandbox by default. Test card
`4242 4242 4242 4242`, any future expiry, any CVC. The SDK tokenizes
in the browser and returns `tok_test_*`. The server should never see
raw card data.

## Repo layout

```
apps/api/          # Express + TS backend
apps/web/          # Angular 17 frontend
libs/ui/           # Shared UI primitives (forms, layout, feedback)
libs/shared-types/ # Cart, Order, User, Address, Money — shared
libs/testing/      # MSW handlers, fixture builders
e2e/               # Playwright specs
ops/               # docker-compose, grafana, k6
docs/              # architecture, conventions, feature-flags, brief
.github/workflows/ # CI
```

## Workshop docs

- [`docs/brief.md`](docs/brief.md) — the ShopStream brief
- [`docs/architecture.md`](docs/architecture.md) — how the pieces fit
- [`docs/conventions.md`](docs/conventions.md) — what "matches the codebase" means
- [`docs/feature-flags.md`](docs/feature-flags.md) — every flag and its default
- [`CLAUDE.md`](CLAUDE.md) — pinned context for Claude Code

## Design system

The web app applies **Airbnb-inspired** design tokens — Rausch
(`#ff385c`) as the single accent, ink (`#222`) on canvas (`#fff`),
hairline borders (`#ddd`), Inter as the open-source substitute for
Airbnb Cereal. See `apps/web/src/styles/_tokens.scss`.

## License

Internal · 8xLabs.ai · 2026
