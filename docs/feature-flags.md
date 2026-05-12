# Feature flags

Flags are simple booleans read from `FF_*` environment variables on
the API process and from a `/api/config` payload on the client.
Defaults are **OFF**. Rename of a flag is a breaking change; treat it
like an API contract.

## Index

| Flag | Default | Owner | Description |
| --- | --- | --- | --- |
| `guest_checkout_enabled` | OFF | retention | Allow shoppers to check out without signing in. Gates `POST /api/checkout/guest` and the `/checkout/guest/*` routes. |
| `account_upsell_after_guest` | OFF | growth | Show "Save your details for next time" card on the confirmation page after a guest order. |

## How to add a new flag

1. Pick a `snake_case` name.
2. Add it to the `envSchema` in `apps/api/src/config/env.ts` with a
   `default('false')` and the `.transform(...)` boolean coercion.
3. Add a `case` to `apps/api/src/lib/feature-flags.ts`.
4. Mirror on the client in
   `apps/web/src/app/core/feature-flags/feature-flags.service.ts`.
5. Add a row to this table. **Do not skip this step** — flag drift is
   the most common cause of incident comments.

## SIGHUP reload

The API process re-reads `FF_*` env vars on `SIGHUP`:

```bash
kill -HUP <pid>
```

In production, a config-management push sends `SIGHUP` after writing
the new env. Tests rely on this for hot-flip scenarios.
