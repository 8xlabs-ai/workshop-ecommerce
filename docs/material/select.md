# MatSelectModule

Dropdown select. **Must** be wrapped in `<mat-form-field>`. Options use `<mat-option>`.

## Import

```ts
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
})
```

## Selectors

| Selector | Purpose |
|----------|---------|
| `<mat-select>` | The control itself |
| `<mat-option>` | Each option with `[value]` |
| `<mat-optgroup>` | Group options under a label |
| `<mat-select-trigger>` | Custom display for the selected value |

## Inputs

- `formControlName` / `[formControl]`
- `multiple` — multi-select
- `placeholder`
- `panelClass` — class on the dropdown overlay
- `compareWith` — equality fn for object values

## Example from project

**City select** — `address-step.component.ts`:

```html
<mat-form-field appearance="outline">
  <mat-label>City</mat-label>
  <mat-select formControlName="city">
    @for (c of cities; track c.value) {
      <mat-option [value]="c.value">{{ c.label }}</mat-option>
    }
  </mat-select>
</mat-form-field>
```

Backed by a typed list:

```ts
import { SAUDI_CITIES } from '../saudi-cities.js';
protected readonly cities = SAUDI_CITIES;
```

## Rules / gotchas

- Must be inside `<mat-form-field>` with `<mat-label>`.
- When `[value]` is an object, set `compareWith` — by default Material compares by reference.
- Loop options with `@for ... track` — never `*ngFor`.
- The dropdown renders in an overlay — confirm parent containers don't have `overflow: hidden` clipping it.
- For multi-select, the control value is an **array**. Set the default to `[]`, not `null`.
