# ShopStream Documentation Index

> **Generated:** 2026-05-13 · **Mode:** initial_scan · **Scan level:** quick
> **Source:** `repos/scaffold/`

## Project Overview

- **Name:** `shopstream-checkout`
- **Type:** Monorepo (pnpm workspaces) with 6 parts
- **Primary Language:** TypeScript
- **Architecture:** Web (Angular 17) ⇄ REST API (Express + TS) ⇄ Postgres / Redis
- **Workshop focus:** Guest-checkout slice behind `FF_GUEST_CHECKOUT_ENABLED` (default OFF)

## Quick Reference by Part

### `api` (backend)
- **Path:** `apps/api/`
- **Stack:** Node 20, Express 4.21, TypeScript 5.5, Postgres 15, Redis 7, JWT, Zod, Pino, OpenTelemetry
- **Entry:** `src/server.ts` → `src/app.ts (createApp)`
- **Pattern:** `router → service → repository`

### `web` (web)
- **Path:** `apps/web/`
- **Stack:** Angular 17.3 standalone, Angular Material, NgRx Signals, RxJS, OpenTelemetry web
- **Entry:** `src/main.ts` (`bootstrapApplication`)

### `ui` (library — 3 packages)
- **Path:** `libs/ui/{feedback,forms,layout}`
- **Stack:** TS-only Angular standalone primitives

### `shared-types` (library)
- **Path:** `libs/shared-types/`
- **Stack:** Pure TS — cross-app domain types

### `testing` (library)
- **Path:** `libs/testing/`
- **Stack:** MSW 2.4 handlers + fixture builders

### `e2e` (library)
- **Path:** `e2e/`
- **Stack:** Playwright 1.47

## Generated Documentation

- [Project Overview](./project-overview.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Integration Architecture](./integration-architecture.md)
- [Development Guide](./development-guide.md)
- [Deployment Guide](./deployment-guide.md)
- [API Contracts](./api-contracts-api.md)
- [Data Models](./data-models-api.md)
- [Component Inventory — Web](./component-inventory-web.md)
- [Component Inventory — UI](./component-inventory-ui.md)

### Per-Part Architecture

- [Architecture — `api`](./architecture-api.md)
- [Architecture — `web`](./architecture-web.md)
- [Architecture — `ui`](./architecture-ui.md)
- [Architecture — `shared-types`](./architecture-shared-types.md)
- [Architecture — `testing`](./architecture-testing.md)
- [Architecture — `e2e`](./architecture-e2e.md)

### Metadata

- [`project-parts.json`](./project-parts.json) — machine-readable parts + integration points
- [`project-scan-report.json`](./project-scan-report.json) — workflow state

## Existing In-Repo Documentation

- [`repos/scaffold/README.md`](../../repos/scaffold/README.md) — high-level stack + quickstart
- [`repos/scaffold/CLAUDE.md`](../../repos/scaffold/CLAUDE.md) — pinned context for Claude Code
- [`repos/scaffold/docs/brief.md`](../../repos/scaffold/docs/brief.md) — workshop business brief
- [`repos/scaffold/docs/architecture.md`](../../repos/scaffold/docs/architecture.md) — original architecture notes
- [`repos/scaffold/docs/conventions.md`](../../repos/scaffold/docs/conventions.md) — coding conventions (source of truth)
- [`repos/scaffold/docs/design-debt.md`](../../repos/scaffold/docs/design-debt.md) — known shortcomings
- [`repos/scaffold/docs/feature-flags.md`](../../repos/scaffold/docs/feature-flags.md) — flag catalog
- [`repos/scaffold/docs/material/*.md`](../../repos/scaffold/docs/material/) — Angular Material primitive refs
- [`repos/scaffold/ops/grafana/README.md`](../../repos/scaffold/ops/grafana/README.md) — local Tempo + Loki

## Getting Started

```bash
cd repos/scaffold
pnpm install
docker compose -f ops/docker-compose.yml up -d
cp apps/api/.env.example apps/api/.env       # edit JWT_SECRET
pnpm --filter @shopstream/api db:migrate
pnpm --filter @shopstream/api db:seed
pnpm dev                                       # api :4000, web :4200
```

Demo accounts: `sara@shopstream.test / shopper123` (etc.). Guest flow must work without these.

## For Brownfield PRD

Point the PRD workflow at this `index.md`. For:
- **API-only features:** start at [architecture-api.md](./architecture-api.md) + [api-contracts-api.md](./api-contracts-api.md) + [data-models-api.md](./data-models-api.md).
- **UI-only features:** start at [architecture-web.md](./architecture-web.md) + [component-inventory-web.md](./component-inventory-web.md) + [component-inventory-ui.md](./component-inventory-ui.md).
- **Full-stack features:** add [integration-architecture.md](./integration-architecture.md).

## Scan Notes

- **Scan level:** quick — pattern + manifest based, no source body reading except a handful of entry points (`app.ts`, migration files, `README.md`, `docs/brief.md`, `docs/architecture.md`).
- **Files read in full:** root `README.md`, `apps/api/src/app.ts`, both migrations, `ops/docker-compose.yml`, `apps/api/.env.example`, `docs/brief.md`, `docs/architecture.md` (first ~60 lines).
- **Re-run with deep or exhaustive scan** to capture Zod schema details, route handler bodies, repository SQL, and component templates.
