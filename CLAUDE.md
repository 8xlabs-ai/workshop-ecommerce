# ShopStream — Claude Code project memory

## Project rules — read me first

- Stack: Node.js 20 + Express + TypeScript, Angular 17 (standalone), Postgres 15, Redis 7.
- Package manager: pnpm. Use `pnpm --filter <name>` for per-app commands.
- Backend layering: router → service → repository. No SQL outside repositories. No ORM.
- Validation: zod schemas in `<module>.schemas.ts`. Never read `req.body` directly.
- Frontend: standalone components, Reactive Forms, signals for state. No NgModules in new code.
- HTTP from Angular: always through `core/http/api.service.ts`.
- Feature flags: `featureFlags.isEnabled('name')` server-side, `*ffEnabled` directive on the client. Default new flags to OFF.
- Logging: pino via `req.log`. Never `console.log`. Never log request bodies (PII).
- Payments: `payx-sdk` tokenizes in the browser. The server only ever sees `tok_*`. Do not introduce any other payment library.
- Telemetry: wrap external calls in `withSpan(...)`. Reuse the OTel helpers in `lib/telemetry.ts`.
- Tests: Vitest (api), Karma + Jasmine (web), Playwright (e2e). Add tests in the same PR as the change.
- Conventional commits. PR title = `type(scope): subject`.

## Do not

- Introduce an ORM (Prisma, Drizzle, TypeORM).
- Add a new payment library.
- Touch `apps/api/src/modules/payments/payx-client.ts` without a security reviewer.
- Disable the feature flag check "just for testing".
- Log raw card data, raw tokens, or full request bodies.
- Roll your own form input — reuse `libs/ui/forms`.
- Add `console.log` or `any` to new code.

## Useful commands

- `pnpm dev` — run api + web together
- `pnpm --filter @shopstream/api test -- checkout` — focused backend tests
- `pnpm --filter @shopstream/web test --watch=false` — once-through frontend tests
- `pnpm e2e -- --grep guest` — focused e2e
- `pnpm --filter @shopstream/api db:migrate` — apply migrations

## Workshop notes

This repo is **brownfield by design**. The logged-in checkout path works today.
Your guest-checkout slice runs alongside it. Do not modify the logged-in path
unless a reviewer specifically asks you to.

The wall you are punching a door through is `apps/web/src/app/core/auth/auth.guard.ts`
and `apps/api/src/middleware/auth.ts`. Read both before prompting any change.

Feature flag for this work: `guest_checkout_enabled`. Default OFF.
