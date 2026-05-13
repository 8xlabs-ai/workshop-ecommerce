# Angular Material — components in use

Reference docs for every `@angular/material` module currently imported in `apps/web`. Version: **`@angular/material@^17.3`** (Material 3 / MDC). Theme: prebuilt **indigo-pink**.

Use these when building new pages so we stay consistent with the existing checkout/catalog UI.

## Global setup (already wired)

- `provideAnimationsAsync()` in `apps/web/src/app/app.config.ts` — required by all overlay-based Material components (select, snack-bar).
- Indigo-pink theme is loaded globally (see `apps/web/src/styles.scss`).
- All consumers are **standalone** — add Material modules to the component's `imports` array. Never use `NgModule`.

## Components

| Module | Doc | What it gives you |
|--------|-----|-------------------|
| `MatButtonModule` | [button.md](./button.md) | `mat-button`, `mat-flat-button`, `mat-stroked-button`, `mat-icon-button` |
| `MatCardModule` | [card.md](./card.md) | `mat-card`, `mat-card-content`, used for radio-card pattern |
| `MatCheckboxModule` | [checkbox.md](./checkbox.md) | `mat-checkbox` with Reactive Forms |
| `MatFormFieldModule` | [form-field.md](./form-field.md) | `mat-form-field` wrapper, `mat-label`, `mat-hint`, `mat-error` |
| `MatIconModule` | [icon.md](./icon.md) | `mat-icon` ligature icons |
| `MatInputModule` | [input.md](./input.md) | `matInput` directive for text inputs |
| `MatRadioModule` | [radio.md](./radio.md) | `mat-radio-group`, `mat-radio-button` |
| `MatSelectModule` | [select.md](./select.md) | `mat-select`, `mat-option` dropdown |
| `MatSnackBar` | [snack-bar.md](./snack-bar.md) | toast/snackbar service |

## House rules

- ✅ Reactive Forms only (`formControlName` / `formControl`).
- ✅ `OnPush` change detection on every component.
- ✅ `appearance="outline"` on every `mat-form-field` (matches checkout).
- ✅ Buttons: `mat-flat-button color="primary"` for primary action, `mat-stroked-button` for secondary/back.
- ❌ No template-driven forms.
- ❌ No `NgModule` — always standalone imports.
- ❌ Don't reach into Material internals or `::ng-deep` unless absolutely required.

## Project examples worth copying

- Form layout pattern → `apps/web/src/app/checkout/steps/guest-contact-step.component.ts`
- Radio-card pattern → `apps/web/src/app/checkout/steps/shipping-step.component.ts`
- Select with options → `apps/web/src/app/checkout/steps/address-step.component.ts`
- Snackbar toast → `apps/web/src/app/catalog/catalog-page.component.ts`
