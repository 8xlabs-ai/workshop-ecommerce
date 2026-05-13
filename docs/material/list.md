# MatListModule

Vertical list of items with optional icons, dividers, and selection. Use for **tier feature lists**, navigation menus, and grouped content.

## Import

```ts
import { MatListModule } from '@angular/material/list';

@Component({
  standalone: true,
  imports: [MatListModule],
})
```

## Variants

| Component | Use for |
|-----------|---------|
| `mat-list` + `mat-list-item` | Plain read-only list |
| `mat-nav-list` + `a mat-list-item` | Navigation list (clickable links) |
| `mat-action-list` + `button mat-list-item` | List of action buttons |
| `mat-selection-list` + `mat-list-option` | Multi-select list with checkboxes |

## Item slots

- `matListItemIcon` — leading icon (use with `<mat-icon>`)
- `matListItemAvatar` — leading avatar (circular image)
- `matListItemTitle` — primary text line
- `matListItemLine` — secondary text line(s)
- `matListItemMeta` — trailing content (icon, badge, text)

## Example — tier feature list

```html
<mat-list>
  <mat-list-item *ngFor="let feature of tier.features">
    <mat-icon matListItemIcon>check</mat-icon>
    <span matListItemTitle>{{ feature.label }}</span>
    <span matListItemLine *ngIf="feature.detail">{{ feature.detail }}</span>
  </mat-list-item>
</mat-list>
```

## Example — selection list (addons)

```html
<mat-selection-list [formControl]="addons">
  <mat-list-option value="sso">Single sign-on (+$10/mo)</mat-list-option>
  <mat-list-option value="audit">Audit logs (+$5/mo)</mat-list-option>
  <mat-list-option value="support">Priority support (+$15/mo)</mat-list-option>
</mat-selection-list>
```

## Rules / gotchas

- Use `mat-nav-list` (not `mat-list`) when items are router links — gets correct keyboard nav and roles.
- `mat-selection-list` works with Reactive Forms and emits selected values as an array.
- For dense layouts, set `density="-2"` (range −1 to −5).
- Don't use `mat-list` for tabular data — use `mat-table` instead.
- Combine with `<mat-divider inset>` for visual separation between items.
