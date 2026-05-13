# MatSidenavModule

Sliding side panel that pushes or overlays main content. Use for **cart drawer**, account sidebar, mobile nav menu.

## Import

```ts
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  standalone: true,
  imports: [MatSidenavModule],
})
```

## Components

- `mat-sidenav-container` — wrapping container (required)
- `mat-sidenav` — the sliding panel
- `mat-sidenav-content` — main content area

## Inputs

- `mat-sidenav [mode]`: `'over' | 'push' | 'side'`
  - `over` — overlay, doesn't push main content (mobile drawers)
  - `push` — pushes main content right (desktop side panel)
  - `side` — stays open inline (permanent sidebar)
- `mat-sidenav [opened]`: boolean — controlled open state
- `mat-sidenav [position]`: `'start' | 'end'` — which side
- `mat-sidenav [disableClose]`: boolean — prevent backdrop click close
- `(openedChange)`: emit on open/close

## Example — cart drawer

```ts
cartOpen = signal(false);
```

```html
<mat-sidenav-container class="ss-page">
  <mat-sidenav #cart mode="over" position="end" [opened]="cartOpen()"
               (openedChange)="cartOpen.set($event)">
    <ss-cart-summary />
  </mat-sidenav>

  <mat-sidenav-content>
    <mat-toolbar>
      <span>ShopStream</span>
      <span class="ss-toolbar__spacer"></span>
      <button mat-icon-button (click)="cartOpen.set(true)">
        <mat-icon>shopping_cart</mat-icon>
      </button>
    </mat-toolbar>
    <router-outlet />
  </mat-sidenav-content>
</mat-sidenav-container>
```

## Rules / gotchas

- `mat-sidenav-container` must wrap BOTH the sidenav and the main content — without it, sidenav won't render.
- `mat-sidenav-container` needs a height to fill — typical pattern: `min-height: 100vh` on the container.
- For mobile: use `mode="over"`. For desktop: use `mode="side"` with media queries to switch modes.
- Don't nest `mat-sidenav-container` inside another — confuses scrolling and focus traps.
- For the trigger button, prefer signals (`signal(false)`) over `BehaviorSubject` for simpler templates.
