# Conventions

These are the rules that determine whether a PR matches the codebase
or not. If your change disagrees with anything here, talk to a
reviewer **before** opening the PR.

## Backend (apps/api)

- One router per module under `modules/<name>/<name>.router.ts`.
- Every request body and query parsed by a zod schema in
  `<name>.schemas.ts`. **Bare `req.body` is a review-blocker.**
- Routers call services. Services call repositories. Repositories own
  SQL. No SQL anywhere else. No ORM.
- Throw subclasses of `HttpError` from `lib/errors.ts`. Never
  `res.status(...).json(...)` inside a service.
- Use the request-scoped `req.log` (pino). Never `console.log`.
- Never log raw request bodies — they may contain PII. The pino
  redact list covers `authorization`, `cookie`, `password`,
  `paymentToken`, and `card`.
- Read feature flags via `featureFlags.isEnabled('snake_case_name', { context })`.
- Wrap external calls (DB outside `pool.query`, HTTP, payx, redis) in
  `withSpan('descriptive.name', async span => …)`.

## Frontend (apps/web)

- Standalone components only. No NgModules in new code.
- Routes are lazy-loaded with `loadComponent` / `loadChildren`.
- Local state: signals. Shared state: `@ngrx/signals` store under
  `*.store.ts`. No RxJS Subjects in components.
- Forms: Reactive (`FormGroup`, `FormControl`). Wrap every input in
  `<ss-form-field>`. Roll-your-own `<input>` is a review-blocker.
- HTTP: only through `core/http/api.service.ts`. Components must not
  import `HttpClient` directly.
- For guest endpoints, pass `{ skipAuth: true }` to `ApiService` — the
  auth interceptor strips the JWT.
- Routing state: query params. **Not** `sessionStorage` in new code.
- Styling: SCSS using the design tokens from `styles/_tokens.scss` and
  mixins from `styles/_typography.scss`. Tailwind is not in this repo.
- i18n: copy lives in `*.i18n.ts` modules, not inline strings.

## Shared

- Shared types in `libs/shared-types`. Imported by both apps.
- Conventional commits, enforced by commitlint:
  - `feat(checkout): add POST /api/checkout/guest behind flag`
  - `fix(orders): allow guest lookup by email`
  - `chore(deps): bump zod to 3.23`
- PR template runs `pnpm lint && pnpm test && pnpm typecheck && pnpm build`.

## What review will reject on sight

- Raw SQL outside a `*.repository.ts`.
- `any` in new code (use `unknown` and narrow).
- A new `console.log`.
- A new payment library.
- A new ORM.
- A skip of the feature flag check "for testing".
- A bypass of `<ss-form-field>`.
- A duplicated `<script>` tag for `payx-sdk` (use the existing loader).
- A new shadow recipe (see `docs/design-debt.md` — use `--shadow-card`).
