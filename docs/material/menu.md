# MatMenuModule

Pop-up menu attached to a trigger button. Use for **account dropdowns**, row actions on tier tables, contextual options.

## Import

```ts
import { MatMenuModule } from '@angular/material/menu';

@Component({
  standalone: true,
  imports: [MatMenuModule],
})
```

## Pattern

```html
<button mat-icon-button [matMenuTriggerFor]="menu">
  <mat-icon>more_vert</mat-icon>
</button>
<mat-menu #menu="matMenu">
  <button mat-menu-item (click)="...">Action 1</button>
  <button mat-menu-item (click)="...">Action 2</button>
</mat-menu>
```

## Inputs

- `matMenuTriggerFor`: reference to `mat-menu` template variable
- `mat-menu [xPosition]`: `'before' | 'after'`
- `mat-menu [yPosition]`: `'above' | 'below'`
- `mat-menu [overlapTrigger]`: boolean

## Example — tier row actions

```html
<button mat-icon-button [matMenuTriggerFor]="tierActions" aria-label="Tier actions">
  <mat-icon>more_vert</mat-icon>
</button>
<mat-menu #tierActions="matMenu">
  <button mat-menu-item (click)="viewDetails()">
    <mat-icon>info</mat-icon><span>View details</span>
  </button>
  <button mat-menu-item (click)="compareTier()">
    <mat-icon>compare_arrows</mat-icon><span>Compare</span>
  </button>
  <button mat-menu-item (click)="cancelPlan()" class="ss-menu-item--warn">
    <mat-icon>cancel</mat-icon><span>Cancel plan</span>
  </button>
</mat-menu>
```

## Example — nested menu

```html
<mat-menu #parent="matMenu">
  <button mat-menu-item [matMenuTriggerFor]="children">Billing</button>
</mat-menu>
<mat-menu #children="matMenu">
  <button mat-menu-item>Monthly</button>
  <button mat-menu-item>Annual</button>
</mat-menu>
```

## Rules / gotchas

- Trigger must be a `<button>` with `[matMenuTriggerFor]` — not a `<div>` or `<a>`.
- Always set `aria-label` on the trigger if it's icon-only.
- Items must be `<button mat-menu-item>` — wrapping in other elements breaks keyboard nav.
- Don't put forms inside `mat-menu` — menu closes on item click. Use `mat-dialog` for forms.
- For long menus (10+ items), consider a different pattern — autocomplete, dialog, or select.
