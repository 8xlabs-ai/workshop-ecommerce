# MatSliderModule

Numeric range input via dragging a thumb. Use for **seat count slider** on price tiers, quantity selectors, volume controls.

## Import

```ts
import { MatSliderModule } from '@angular/material/slider';

@Component({
  standalone: true,
  imports: [MatSliderModule],
})
```

## Structure (M3 / v17)

```html
<mat-slider min="..." max="..." step="..." discrete>
  <input matSliderThumb [formControl]="..." />
</mat-slider>
```

> Material 17 uses a **wrapping `mat-slider` + nested `input matSliderThumb`** pattern. Old `[(value)]` binding on `mat-slider` is removed.

## Inputs

- `min` / `max`: number — range bounds
- `step`: number — increment
- `discrete`: boolean — show value label on thumb
- `showTickMarks`: boolean — show step marks
- `disabled`: boolean

## Example — seat slider for team tier

```ts
seats = new FormControl(5, { nonNullable: true });
get price() { return this.seats.value * 12; }
```

```html
<label>Team size: {{ seats.value }} seats — ${{ price }}/mo</label>
<mat-slider min="1" max="50" step="1" discrete showTickMarks>
  <input matSliderThumb [formControl]="seats" />
</mat-slider>
```

## Example — range slider (two thumbs)

```html
<mat-slider min="0" max="500" step="10">
  <input matSliderStartThumb [formControl]="minBudget" />
  <input matSliderEndThumb   [formControl]="maxBudget" />
</mat-slider>
```

## Rules / gotchas

- Always wrap with `mat-slider` and put `input matSliderThumb` INSIDE — `mat-slider` alone won't render an input.
- `discrete` is required to show the value tooltip on the thumb. Otherwise users see no number.
- For range sliders, use `matSliderStartThumb` + `matSliderEndThumb` (not two `matSliderThumb`).
- Reactive Forms: bind `[formControl]` on the `<input matSliderThumb>`, NOT on `<mat-slider>`.
- Don't use sliders for precise numeric input — pair with a number `<input>` or `mat-form-field` for typing.
