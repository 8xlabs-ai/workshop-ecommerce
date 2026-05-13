# MatExpansionModule

Collapsible panels (accordion). Use for **"See all features"** on tier cards, FAQ sections, advanced settings.

## Import

```ts
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  standalone: true,
  imports: [MatExpansionModule],
})
```

## Components

- `mat-accordion` — container (optional, manages multi/single panel open)
- `mat-expansion-panel` — single collapsible panel
- `mat-expansion-panel-header` — clickable header
- `mat-panel-title` / `mat-panel-description` — header text

## Inputs

- `mat-accordion [multi]`: boolean — allow multiple panels open at once
- `mat-expansion-panel [expanded]`: boolean — controlled state
- `mat-expansion-panel [disabled]`: boolean
- `hideToggle`: boolean — hide arrow icon

## Example — tier "see more features"

```html
<mat-expansion-panel>
  <mat-expansion-panel-header>
    <mat-panel-title>See all Pro features</mat-panel-title>
  </mat-expansion-panel-header>

  <ul class="ss-feature-list">
    <li>Up to 10 users</li>
    <li>50 GB storage</li>
    <li>Custom domain</li>
    <li>API access</li>
    <li>Email support</li>
  </ul>
</mat-expansion-panel>
```

## Example — FAQ accordion

```html
<mat-accordion>
  <mat-expansion-panel *ngFor="let item of faq">
    <mat-expansion-panel-header>
      <mat-panel-title>{{ item.question }}</mat-panel-title>
    </mat-expansion-panel-header>
    <p>{{ item.answer }}</p>
  </mat-expansion-panel>
</mat-accordion>
```

## Rules / gotchas

- Without `mat-accordion` wrapper, each panel manages its own state independently.
- `[multi]="true"` allows multiple open panels — default is single (radio-like).
- Animations require `provideAnimationsAsync()` — already wired in `app.config.ts`.
- Don't put forms with validation inside collapsed panels — users may not see errors. Either open by default or scroll into view on submit.
- For lazy content rendering: wrap content inside `<ng-template matExpansionPanelContent>...</ng-template>`.
