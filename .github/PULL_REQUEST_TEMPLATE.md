## Summary

<!-- 1–3 bullets, including the conventional-commit subject -->

## Why

<!-- The motivation. Bug ticket, retro item, customer report — link it. -->

## How

<!-- Mention the architectural seam (feature flag, new route, schema change). -->

## Test plan

- [ ] `pnpm lint` clean
- [ ] `pnpm typecheck` clean
- [ ] `pnpm test` green
- [ ] Manual verification on `pnpm dev`
- [ ] If touching `/api/payments/**` or migrations: security reviewer approved

## Out of scope

<!-- Anything you deliberately did not change. Helps the reviewer. -->
