# Architecture — `testing`

> Project type: **library** · Path: `libs/testing/` · Package: `@shopstream/testing`

## Purpose

Shared test utilities — primarily MSW (Mock Service Worker) handlers that emulate the api surface, plus fixture builders. Used by component-level tests in `apps/web` and potentially in API tests.

## Stack

| Category | Technology | Version |
|----------|------------|---------|
| Language | TypeScript | 5.5 |
| API mocking | `msw` | ^2.4 |
| Workspace dep | `@shopstream/shared-types` | workspace:* |

## Modules

| File | Purpose |
|------|---------|
| `src/handlers.ts` | MSW `http.*` handlers mirroring `apps/api` endpoints |
| `src/fixtures.ts` | Factory builders for cart, address, order, user, money — typed via `shared-types` |
| `src/index.ts` | Barrel export |

## Consumers

- Web component tests can plug handlers into `setupWorker`/`setupServer`.
- Fixture builders give deterministic test data without re-typing shapes.

## Conventions

- Handlers stay strictly typed to `shared-types`. If the api adds an endpoint, mirror it here.
- Fixtures override defaults via partial input (`buildCart({ items: [...] })` pattern).
