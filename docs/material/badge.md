# MatBadgeModule

Small overlaid label on another element. Use for **cart item count**, notification dots, "New" markers on tier cards.

## Import

```ts
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  standalone: true,
  imports: [MatBadgeModule],
})
```

## Directive

```html
<element matBadge="3" />
```

## Inputs

- `matBadge`: string | number — badge content
- `matBadgeColor`: `'primary' | 'accent' | 'warn'`
- `matBadgePosition`: `'above after' | 'above before' | 'below after' | 'below before'`
- `matBadgeSize`: `'small' | 'medium' | 'large'`
- `matBadgeOverlap`: boolean — overlap host element (default true for icons)
- `matBadgeHidden`: boolean — hide without removing from DOM
- `matBadgeDescription`: string — accessible description

## Example — cart icon with count

```html
<button mat-icon-button
        [matBadge]="cartCount()"
        [matBadgeHidden]="cartCount() === 0"
        matBadgeColor="warn"
        matBadgeDescription="items in cart">
  <mat-icon>shopping_cart</mat-icon>
</button>
```

## Example — "New" marker on tier

```html
<h3 class="ss-tier-name"
    matBadge="NEW"
    matBadgeColor="accent"
    matBadgeOverlap="false"
    matBadgePosition="after">
  Enterprise
</h3>
```

## Rules / gotchas

- Always set `matBadgeDescription` for screen readers when the badge content is a number (e.g. "5 unread notifications").
- Use `matBadgeHidden` instead of `*ngIf` when toggling — keeps element in DOM, avoids reflow.
- For dot badges (no number), pass empty string: `matBadge=""`. Combine with `matBadgeSize="small"`.
- Don't put badges on `mat-form-field` or other complex Material components — overlap math gets wrong. Stick to icons, buttons, plain text.
- Long text in badges truncates ugly — keep to ≤ 4 characters.
