# MatChipsModule

Compact tags/labels and selectable filter chips. Use for **tier badges** ("Most Popular", "Best Value"), category filters, and selection groups.

## Import

```ts
import { MatChipsModule } from '@angular/material/chips';

@Component({
  standalone: true,
  imports: [MatChipsModule],
})
```

## Variants

| Component | Use for |
|-----------|---------|
| `mat-chip-set` | Static read-only chip group |
| `mat-chip-listbox` + `mat-chip-option` | Single/multi-select chips (filter) |
| `mat-chip-grid` + `mat-chip-row` + `matChipInput` | Input chips (tag entry) |
| `mat-chip` | Standalone label chip |

## Inputs

- `mat-chip-listbox [multiple]`: boolean — multi-select
- `mat-chip-option [selected]`: boolean
- `mat-chip [removable]` + `(removed)`: removable chip
- `color`: `'primary' | 'accent' | 'warn'`

## Example — tier badges

```html
<mat-card class="ss-tier-card">
  <mat-chip color="accent" highlighted>Most Popular</mat-chip>
  <h3>Pro</h3>
  <p>$29 / month</p>
</mat-card>
```

## Example — billing filter

```html
<mat-chip-listbox [formControl]="billingCycle" aria-label="Billing cycle">
  <mat-chip-option value="monthly">Monthly</mat-chip-option>
  <mat-chip-option value="annual">Annual <span class="ss-discount">−20%</span></mat-chip-option>
</mat-chip-listbox>
```

## Rules / gotchas

- Use `mat-chip-listbox` (not `mat-chip-set`) when chips are selectable — they get correct ARIA roles automatically.
- `mat-chip-listbox` integrates with Reactive Forms via `formControl` / `formControlName`.
- For input chips (tag entry), use `mat-chip-grid`, not `mat-chip-listbox`.
- `highlighted` makes chip use primary color background — preferred over manual color styling.
- Avoid using chips as buttons — use `mat-button` for actions.
