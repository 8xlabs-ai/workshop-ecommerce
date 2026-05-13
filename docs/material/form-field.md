# MatFormFieldModule

Wrapper for form controls. Provides label, hint, error, prefix/suffix layout. **Required** around every `matInput`, `mat-select`, and similar control.

Project standard: **`appearance="outline"`** on every form field.

## Import

```ts
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  imports: [MatFormFieldModule],
})
```

> Pair with `MatInputModule` for text inputs and `MatSelectModule` for selects.

## Child directives

| Selector | Purpose |
|----------|---------|
| `<mat-label>` | Floating label |
| `<mat-hint>` | Help text below field |
| `<mat-error>` | Validation error (shown when control invalid + touched) |
| `matPrefix` / `matSuffix` | Adornments inside the field (icons, text) |

## Inputs

- `appearance`: `'fill' | 'outline'` — **use `outline`**
- `floatLabel`: `'auto' | 'always'`
- `hideRequiredMarker`: boolean

## Examples from project

**Standard input with hint** — `guest-contact-step.component.ts`:

```html
<mat-form-field appearance="outline">
  <mat-label>Email</mat-label>
  <input matInput formControlName="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" />
  <mat-hint>We don't share your email. Order updates only.</mat-hint>
</mat-form-field>
```

**Two-column row layout**:

```html
<div class="ss-step__row">
  <mat-form-field appearance="outline">
    <mat-label>First name</mat-label>
    <input matInput formControlName="firstName" autocomplete="given-name" />
  </mat-form-field>
  <mat-form-field appearance="outline">
    <mat-label>Last name</mat-label>
    <input matInput formControlName="lastName" autocomplete="family-name" />
  </mat-form-field>
</div>
```

```css
.ss-step__row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
mat-form-field { width: 100%; }
@media (max-width: 640px) { .ss-step__row { grid-template-columns: 1fr; } }
```

**With dynamic hint** — `payment-step.component.ts`:

```html
<mat-form-field appearance="outline">
  <mat-label>Card number</mat-label>
  <input matInput formControlName="number" inputmode="numeric" autocomplete="cc-number" (input)="onNumberInput($event)" />
  @if (brandHint()) { <mat-hint>{{ brandHint() }}</mat-hint> }
</mat-form-field>
```

## Rules / gotchas

- Form field has no default width — set `mat-form-field { width: 100%; }` so it fills its container.
- Only **one** control allowed inside a form field. Wrap each input separately.
- `mat-error` appears automatically when its parent control is invalid + touched/dirty.
- Don't mix `mat-hint` and `mat-error` showing simultaneously — error replaces hint when active.
- Always provide a `mat-label`. Don't rely on `placeholder` alone.
