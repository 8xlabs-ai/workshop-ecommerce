# MatToolbarModule

App-level horizontal bar for title, actions, navigation. Use for **page headers**, top nav, section headers.

## Import

```ts
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  standalone: true,
  imports: [MatToolbarModule],
})
```

## Components

- `mat-toolbar` — single-row toolbar
- `mat-toolbar-row` — additional rows inside `mat-toolbar` (multi-row)

## Inputs

- `color`: `'primary' | 'accent' | 'warn'` — sets background color
- `density`: number — compact mode

## Example — page header

```html
<mat-toolbar color="primary">
  <span>ShopStream</span>
  <span class="ss-toolbar__spacer"></span>
  <button mat-icon-button [matBadge]="cartCount()" matBadgeColor="warn"
          [routerLink]="['/cart']" aria-label="Cart">
    <mat-icon>shopping_cart</mat-icon>
  </button>
  <button mat-icon-button [matMenuTriggerFor]="userMenu" aria-label="Account">
    <mat-icon>account_circle</mat-icon>
  </button>
</mat-toolbar>
```

```css
.ss-toolbar__spacer { flex: 1 1 auto; }
```

## Example — multi-row toolbar

```html
<mat-toolbar>
  <mat-toolbar-row>
    <span>ShopStream</span>
    <span class="ss-toolbar__spacer"></span>
    <button mat-button>Sign in</button>
  </mat-toolbar-row>
  <mat-toolbar-row>
    <button mat-button>Catalog</button>
    <button mat-button>Pricing</button>
    <button mat-button>Docs</button>
  </mat-toolbar-row>
</mat-toolbar>
```

## Rules / gotchas

- `mat-toolbar` is a flex container — use a spacer div with `flex: 1 1 auto` to push items right.
- Use `color="primary"` for the main app toolbar; default (transparent) for secondary section toolbars.
- For sticky toolbars, wrap in a container with `position: sticky; top: 0; z-index: 2`.
- Don't put forms inside `mat-toolbar` — it's for navigation and actions.
- Toolbar height is fixed (64px default, 56px mobile). Don't fight it — design around it.
