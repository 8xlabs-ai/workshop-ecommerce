# MatSlideToggleModule

iOS-style on/off switch. Use for **boolean preferences** (monthly/annual toggle as binary, dark mode, notifications enabled).

## Import

```ts
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  standalone: true,
  imports: [MatSlideToggleModule],
})
```

## Inputs

- `color`: `'primary' | 'accent' | 'warn'`
- `disabled`: boolean
- `labelPosition`: `'before' | 'after'`
- `[formControl]` / `[formControlName]` — Reactive Forms
- `hideIcon`: boolean — hide the checkmark inside the toggle

## Example — annual billing toggle

```ts
annualBilling = new FormControl(false, { nonNullable: true });
```

```html
<mat-slide-toggle [formControl]="annualBilling" color="primary">
  Annual billing — <strong>save 20%</strong>
</mat-slide-toggle>
```

## Example — addon enable

```html
<mat-slide-toggle [formControl]="ssoEnabled">
  Enable SSO (+$10/mo)
</mat-slide-toggle>
```

## Rules / gotchas

- Use `mat-slide-toggle` only for **immediate** boolean settings (no Save button needed).
- For settings that require an explicit save action, use `mat-checkbox` instead — toggles imply instant effect.
- Don't use slide-toggle for binary segmented choices like Monthly/Annual where both options need labels visible — use `mat-button-toggle-group` instead.
- The label is the toggle's accessible name — never use an empty `<mat-slide-toggle></mat-slide-toggle>` without text or `aria-label`.
- Color defaults to accent (pink) — set `color="primary"` for indigo (matches project theme).
