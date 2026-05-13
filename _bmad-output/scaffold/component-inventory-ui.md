# Component Inventory — `ui`

> Reusable standalone Angular primitives from `libs/ui/{feedback,forms,layout}`.

## Forms (`@shopstream/ui-forms`)

| Component | File | Category |
|-----------|------|----------|
| `ButtonComponent` | `libs/ui/forms/src/button.component.ts` | Action |
| `TextInputComponent` | `libs/ui/forms/src/text-input.component.ts` | Input |
| `SelectComponent` | `libs/ui/forms/src/select.component.ts` | Input |
| `CheckboxComponent` | `libs/ui/forms/src/checkbox.component.ts` | Input |
| `RadioComponent` | `libs/ui/forms/src/radio.component.ts` | Input |
| `RadioCardComponent` | `libs/ui/forms/src/radio-card.component.ts` | Input (card-styled) |
| `QuantityStepperComponent` | `libs/ui/forms/src/quantity-stepper.component.ts` | Input (numeric stepper) |
| `FormFieldComponent` | `libs/ui/forms/src/form-field.component.ts` | Layout wrapper for inputs |
| `ErrorSummaryComponent` | `libs/ui/forms/src/error-summary.component.ts` | Display (form-level errors) |

## Feedback (`@shopstream/ui-feedback`)

| Component / Service | File | Category |
|---------------------|------|----------|
| `InlineBannerComponent` | `libs/ui/feedback/src/inline-banner.component.ts` | Display |
| `ToastService` | `libs/ui/feedback/src/toast.service.ts` | Service (imperative) |

## Layout (`@shopstream/ui-layout`)

| Component | File | Category |
|-----------|------|----------|
| `AppShellComponent` | `libs/ui/layout/src/app-shell.component.ts` | Layout |
| `PageHeaderComponent` | `libs/ui/layout/src/page-header.component.ts` | Layout |
| `EmptyStateComponent` | `libs/ui/layout/src/empty-state.component.ts` | Display |

## Design System Notes

- All components are standalone (no NgModules), tree-shakeable when imported individually.
- Each package exports a barrel `src/index.ts` — consumers can `import { ButtonComponent } from '@shopstream/ui-forms'`.
- Underlying Angular Material primitives referenced in `repos/scaffold/docs/material/{button,card,checkbox,form-field,icon,input,radio,select,snack-bar}.md`.
- Tokens / typography / breakpoints live in `apps/web/src/styles/` — not in the libs themselves.

## Usage

```ts
// apps/web component
import { Component } from '@angular/core';
import { ButtonComponent, TextInputComponent } from '@shopstream/ui-forms';
import { InlineBannerComponent } from '@shopstream/ui-feedback';

@Component({
  standalone: true,
  imports: [ButtonComponent, TextInputComponent, InlineBannerComponent],
  template: `...`
})
export class MyComponent {}
```
