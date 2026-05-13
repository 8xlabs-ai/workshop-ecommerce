# MatIconModule

Renders Material icons. Default font is **Material Icons** (ligature-based).

## Import

```ts
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [MatIconModule],
})
```

> The Material Icons font is loaded globally in `apps/web/src/index.html` — no per-component setup.

## Usage

Pass icon ligature name as element text:

```html
<mat-icon>add</mat-icon>
<mat-icon>remove</mat-icon>
<mat-icon>check_circle</mat-icon>
```

Full icon list: https://fonts.google.com/icons

## Inputs

- `fontIcon`: alternative ligature input
- `color`: `'primary' | 'accent' | 'warn'`
- `inline`: boolean — sizes to surrounding text instead of fixed 24px

## Examples from project

**Inside `mat-icon-button`** — `catalog-page.component.ts`:

```html
<button mat-icon-button aria-label="Increase" (click)="onQty(line.id, line.quantity + 1)">
  <mat-icon>add</mat-icon>
</button>
```

**Inline status icon in banner** — `address-step.component.ts`:

```html
<mat-card-content>
  <mat-icon>check_circle</mat-icon>
  <div>
    <strong>10% Jeddah discount applied</strong>
    <p>We've taken 10% off your cart total.</p>
  </div>
</mat-card-content>
```

```css
.ss-banner[data-tone='success'] mat-icon { color: #1a7a4c; }
```

## Rules / gotchas

- Always pair `mat-icon-button` with `aria-label` — icon alone is not accessible.
- Use snake_case ligature names (`check_circle`, not `check-circle` or `checkCircle`).
- Default size is 24×24px. Use `[inline]="true"` to scale with text.
- Color via parent CSS, not inline styles — keeps theming consistent.
