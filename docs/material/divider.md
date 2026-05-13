# MatDividerModule

Thin horizontal or vertical separator. Use inside cards, lists, and price tier blocks to separate feature groups.

## Import

```ts
import { MatDividerModule } from '@angular/material/divider';

@Component({
  standalone: true,
  imports: [MatDividerModule],
})
```

## Inputs

- `vertical`: boolean — render vertically (requires parent height)
- `inset`: boolean — adds 80px left margin (typical for list separators)

## Example — inside tier card

```html
<mat-card class="ss-tier-card">
  <h3>Pro</h3>
  <p class="ss-price">$29 <span>/mo</span></p>
  <mat-divider />
  <ul class="ss-feature-list">
    <li>10 users</li>
    <li>50 GB storage</li>
    <li>Email support</li>
  </ul>
  <mat-divider />
  <button mat-flat-button color="primary">Choose Pro</button>
</mat-card>
```

## Example — vertical separator in toolbar

```html
<div class="ss-toolbar">
  <button mat-button>Account</button>
  <mat-divider vertical />
  <button mat-button>Billing</button>
</div>
```

## Rules / gotchas

- For `vertical`, the parent must have a defined height — divider has no intrinsic height.
- `inset` only applies on horizontal dividers inside `mat-list`.
- Don't overuse dividers — generous whitespace usually communicates separation better.
- Use `<mat-divider />` (self-closing) — it has no content.
