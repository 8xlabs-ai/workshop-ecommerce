# MatProgressBarModule

Linear progress indicator. Use for **tier usage indicators** (15/50 GB used), upload progress, page-level loading.

## Import

```ts
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  standalone: true,
  imports: [MatProgressBarModule],
})
```

## Inputs

- `mode`: `'determinate' | 'indeterminate' | 'buffer' | 'query'`
- `value`: number (0–100) — for determinate mode
- `bufferValue`: number (0–100) — for buffer mode
- `color`: `'primary' | 'accent' | 'warn'`

## Example — storage usage on tier card

```ts
get storagePct() { return (this.used / this.total) * 100; }
```

```html
<div class="ss-usage">
  <div class="ss-usage__label">
    Storage: {{ used }} GB of {{ total }} GB
  </div>
  <mat-progress-bar mode="determinate"
                    [value]="storagePct"
                    [color]="storagePct > 90 ? 'warn' : 'primary'" />
</div>
```

## Example — page loading

```html
<mat-progress-bar mode="indeterminate" *ngIf="loading()" />
```

## Rules / gotchas

- Use `mode="indeterminate"` only when you don't know the duration (network calls, API loads).
- For known-progress tasks (uploads, multi-step), use `mode="determinate"` with `[value]`.
- `color="warn"` (red) is a strong signal — reserve for capacity warnings (>90% full), errors. Don't use as default.
- Place at the top of a container (under toolbar) for page loading, not in the middle.
- For circular/contained loading, use `mat-progress-spinner` instead.
