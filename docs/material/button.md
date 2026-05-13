# MatButtonModule

Material button directives. Project standard: `mat-flat-button color="primary"` for primary CTA, `mat-stroked-button` for secondary/back, `mat-icon-button` for icon-only actions.

## Import

```ts
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [MatButtonModule],
  // ...
})
```

## Variants

| Directive | Use for |
|-----------|---------|
| `mat-button` | Text-only, low emphasis |
| `mat-flat-button` | **Primary CTA** (filled) |
| `mat-stroked-button` | Secondary action (outlined) |
| `mat-raised-button` | Avoid — not used in project |
| `mat-icon-button` | Icon-only action (e.g. qty stepper) |
| `mat-fab` / `mat-mini-fab` | Not used in project |

## Inputs

- `color`: `'primary' | 'accent' | 'warn'`
- `disabled`: boolean
- `type`: standard HTML (`submit` / `button`)

## Examples from project

**Primary submit + back pair** — `guest-contact-step.component.ts`:

```html
<div class="ss-step__actions">
  <a routerLink="/cart">← Back to cart</a>
  <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
    Continue to shipping
  </button>
</div>
```

**Stroked back + flat primary** — `payment-step.component.ts`:

```html
<button mat-stroked-button type="button" (click)="back()">Back</button>
<button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
  Review order
</button>
```

**Icon button (qty stepper)** — `catalog-page.component.ts`:

```html
<button mat-icon-button type="button" aria-label="Decrease" (click)="onQty(line.id, line.quantity - 1)">
  <mat-icon>remove</mat-icon>
</button>
```

## Rules / gotchas

- Always set `type="button"` on non-submit buttons inside a `<form>` — default `type="submit"` will fire form submission.
- `mat-icon-button` requires `aria-label` for screen readers.
- Disable via `[disabled]="form.invalid"` not `[attr.disabled]`.
- Don't wrap a `<button mat-*>` in another button or anchor.
