# MatButtonToggleModule

Segmented control for mutually-exclusive choices. Use for **billing period toggle** (Monthly / Annual), view switchers (Grid / List), unit pickers.

## Import

```ts
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  standalone: true,
  imports: [MatButtonToggleModule],
})
```

## Components

- `mat-button-toggle-group` — container, manages selection state
- `mat-button-toggle [value]` — single option

## Inputs

- `mat-button-toggle-group [multiple]`: boolean — multi-select mode
- `mat-button-toggle-group [hideSingleSelectionIndicator]`: boolean — hide check icon
- `mat-button-toggle-group [vertical]`: boolean — stack vertically
- `appearance`: `'standard' | 'legacy'`
- `[formControl]` / `[formControlName]` — Reactive Forms

## Example — billing period

```ts
billingCycle = new FormControl<'monthly' | 'annual'>('monthly', { nonNullable: true });
```

```html
<mat-button-toggle-group [formControl]="billingCycle" hideSingleSelectionIndicator>
  <mat-button-toggle value="monthly">Monthly</mat-button-toggle>
  <mat-button-toggle value="annual">Annual — save 20%</mat-button-toggle>
</mat-button-toggle-group>
```

## Example — multi-select filter

```html
<mat-button-toggle-group multiple [formControl]="enabledAddons">
  <mat-button-toggle value="sso">SSO</mat-button-toggle>
  <mat-button-toggle value="audit">Audit logs</mat-button-toggle>
  <mat-button-toggle value="support">24/7 support</mat-button-toggle>
</mat-button-toggle-group>
```

## Rules / gotchas

- Prefer button-toggle over radio-group when options are short and side-by-side (segmented control aesthetic).
- For longer lists or icon-heavy options, use `mat-radio-group` instead.
- `hideSingleSelectionIndicator` is recommended for clean segmented look (no checkmark inside selected item).
- Don't mix `value` types in one group — keep TypeScript happy with a union.
- For binary toggles (on/off), use `mat-slide-toggle` instead.
