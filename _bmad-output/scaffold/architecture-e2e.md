# Architecture — `e2e`

> Project type: **library** · Path: `e2e/` · Package: `@shopstream/e2e`

## Purpose

End-to-end browser test suite for the full guest + logged-in checkout flows. Drives real `web` + `api` via Playwright.

## Stack

| Category | Technology | Version |
|----------|------------|---------|
| Runner | `@playwright/test` | 1.47 |
| Language | TypeScript | 5.5 |

## Specs

| Spec | Covers |
|------|--------|
| `tests/guest-checkout.spec.ts` | Guest flow: contact → shipping/payment → review → order (no auth) |
| `tests/logged-in-checkout.spec.ts` | Authenticated checkout: sign-in → cart → checkout → confirmation |

## Commands

| Command | What |
|---------|------|
| `pnpm e2e` | Run all specs headless |
| `pnpm --filter @shopstream/e2e e2e:ui` | Playwright UI |
| `pnpm --filter @shopstream/e2e e2e:report` | Show last HTML report |

## Conventions

- Tests assume `pnpm dev` is running (or use Playwright `webServer` config — see `playwright.config.ts`).
- Demo accounts (`sara@shopstream.test`, etc.) seeded via `pnpm --filter @shopstream/api db:seed`.
- Guest test runs against `FF_GUEST_CHECKOUT_ENABLED=true` env.

## Filtering

```bash
pnpm e2e -- --grep guest
pnpm e2e -- --grep "logged-in"
```
