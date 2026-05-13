# Architecture — `ui` (Angular UI primitives)

> Project type: **library** · Path: `libs/ui/{feedback,forms,layout}`

## Executive Summary

Three sibling workspace packages providing reusable Angular standalone components and one service. Consumed by `apps/web` via `workspace:*` deps. No external runtime — pure TS + Angular.

## Packages

| Package | Name | Role |
|---------|------|------|
| `libs/ui/feedback` | `@shopstream/ui-feedback` | Inline banner + toast service |
| `libs/ui/forms` | `@shopstream/ui-forms` | Buttons, inputs, select, checkbox, radios, error summary, quantity stepper, form-field wrapper |
| `libs/ui/layout` | `@shopstream/ui-layout` | App shell, page header, empty state |

## Architecture Pattern

Each package:
- Exports standalone components/services through a barrel `src/index.ts`.
- Builds via package-local `tsconfig.json` (no separate `ng-packagr` step — consumed as TS source).
- Depends on Angular peer (`@angular/*` provided by consumer).

```
libs/ui/<pkg>/
├── package.json          name + workspace deps
├── tsconfig.json
└── src/
    ├── <component>.component.ts
    └── index.ts           barrel
```

## Component Inventory

### `@shopstream/ui-feedback`
- `InlineBannerComponent` — inline contextual notice (success/warning/error).
- `ToastService` — imperative toast dispatch.

### `@shopstream/ui-forms`
- `ButtonComponent`
- `TextInputComponent`
- `SelectComponent`
- `CheckboxComponent`
- `RadioComponent`
- `RadioCardComponent`
- `FormFieldComponent` (wrapper)
- `ErrorSummaryComponent`
- `QuantityStepperComponent`

### `@shopstream/ui-layout`
- `AppShellComponent`
- `PageHeaderComponent`
- `EmptyStateComponent`

## Conventions

- Standalone components (no NgModules).
- No direct app imports — only depend on `@angular/*` peers and `@shopstream/shared-types`.
- Material refs in `docs/material/*.md` document the underlying MAT primitives leveraged (button, input, radio, etc.).

## Consumers

- `apps/web` declares each package in `dependencies` as `workspace:*`.

## Source Tree

See [source-tree-analysis.md → libs/ui](./source-tree-analysis.md#libsui--ui-primitives-3-packages).

## Component Inventory Detail

See [Component Inventory — UI](./component-inventory-ui.md).
