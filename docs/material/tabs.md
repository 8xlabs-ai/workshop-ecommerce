# MatTabsModule

Horizontal tab navigation for grouped views. Use for **tier category switching** (Personal / Team / Enterprise), settings sections, dashboard views.

## Import

```ts
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  standalone: true,
  imports: [MatTabsModule],
})
```

## Components

| Component | Purpose |
|-----------|---------|
| `mat-tab-group` | Tab container |
| `mat-tab [label]` | Single tab with content |
| `mat-tab-nav-bar` + `mat-tab-link` | Router-driven tab bar (URL changes) |

## Inputs

- `mat-tab-group [selectedIndex]`: number — controlled selection
- `(selectedIndexChange)`: emit on tab change
- `animationDuration`: `'500ms'` or `'0ms'` to disable
- `mat-tab [disabled]`: boolean

## Example — tier categories

```html
<mat-tab-group (selectedIndexChange)="onTierCategoryChange($event)">
  <mat-tab label="Personal">
    <ss-tier-grid [tiers]="personalTiers" />
  </mat-tab>
  <mat-tab label="Team">
    <ss-tier-grid [tiers]="teamTiers" />
  </mat-tab>
  <mat-tab label="Enterprise">
    <ss-tier-grid [tiers]="enterpriseTiers" />
  </mat-tab>
</mat-tab-group>
```

## Example — router tabs

```html
<nav mat-tab-nav-bar [tabPanel]="tabPanel">
  <a mat-tab-link routerLink="./overview" routerLinkActive #ov="routerLinkActive" [active]="ov.isActive">Overview</a>
  <a mat-tab-link routerLink="./pricing" routerLinkActive #pr="routerLinkActive" [active]="pr.isActive">Pricing</a>
</nav>
<mat-tab-nav-panel #tabPanel><router-outlet /></mat-tab-nav-panel>
```

## Rules / gotchas

- Use `mat-tab-nav-bar` (not `mat-tab-group`) when tabs map to routes — URL is the source of truth.
- Lazy tab content: wrap inside `<ng-template matTabContent>...</ng-template>` to defer rendering until tab is selected.
- Don't nest `mat-tab-group` inside another `mat-tab-group` — confusing UX and a11y.
- `animationDuration="0ms"` to disable swipe animation if it causes layout shift.
- Tab labels accept rich content via `<ng-template mat-tab-label>` if you need icons or badges.
