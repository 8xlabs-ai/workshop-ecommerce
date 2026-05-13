# MatProgressSpinnerModule

Circular spinner. Use for **inline loading** inside buttons, card-level loading states, modal loaders.

## Import

```ts
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  imports: [MatProgressSpinnerModule],
})
```

## Components

- `mat-progress-spinner` — circular spinner
- `mat-spinner` — shortcut for indeterminate mode

## Inputs

- `mode`: `'determinate' | 'indeterminate'`
- `value`: number (0–100) — for determinate mode
- `diameter`: number (px) — overall size, default 100
- `strokeWidth`: number (px) — ring thickness
- `color`: `'primary' | 'accent' | 'warn'`

## Example — inline loading inside button

```html
<button mat-flat-button color="primary" [disabled]="submitting()" type="submit">
  <mat-spinner *ngIf="submitting()" diameter="18" />
  <span *ngIf="!submitting()">Confirm purchase</span>
</button>
```

## Example — card-level loader

```html
<mat-card class="ss-tier-card" *ngIf="loading(); else loaded">
  <mat-spinner diameter="48" />
</mat-card>
<ng-template #loaded>
  <ss-tier-content [tier]="tier()" />
</ng-template>
```

## Rules / gotchas

- Use `mat-spinner` (shortcut) when always indeterminate — less typing.
- `diameter="18"` is the right size for inline-in-button use. Default 100 is too big.
- For full-page loading, prefer `mat-progress-bar` at the top — feels less heavy.
- Don't show a spinner < 300ms — flashing spinners are worse than no spinner. Use `delay()` operator on the loading state.
- `strokeWidth` defaults to 10% of diameter — adjust if it looks too thick at small sizes.
