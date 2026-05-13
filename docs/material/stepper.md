# MatStepperModule

Multi-step wizard navigation. Use for **tier selection wizards** (Choose plan → Customize → Pay), onboarding flows, multi-page checkouts.

## Import

```ts
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  standalone: true,
  imports: [MatStepperModule],
})
```

## Variants

- `mat-horizontal-stepper` (or `mat-stepper`) — horizontal step indicator
- `mat-vertical-stepper` — vertical step indicator
- `[linear]="true"` — block forward navigation until current step is valid

## Step structure

```html
<mat-stepper linear>
  <mat-step [stepControl]="planForm" label="Choose plan">
    <form [formGroup]="planForm">...</form>
    <button mat-flat-button color="primary" matStepperNext>Next</button>
  </mat-step>
  <mat-step [stepControl]="addonsForm" label="Customize">
    <form [formGroup]="addonsForm">...</form>
    <button mat-stroked-button matStepperPrevious>Back</button>
    <button mat-flat-button color="primary" matStepperNext>Next</button>
  </mat-step>
  <mat-step label="Review &amp; pay">
    <ss-payment-form />
    <button mat-stroked-button matStepperPrevious>Back</button>
    <button mat-flat-button color="primary" (click)="submit()">Pay now</button>
  </mat-step>
</mat-stepper>
```

## Inputs

- `linear`: boolean — enforce step order (require valid `stepControl` to advance)
- `mat-step [stepControl]`: FormGroup — validates the step
- `mat-step [optional]`: boolean — allow skipping
- `mat-step [completed]`: boolean — controlled completion
- `mat-step [editable]`: boolean — allow returning to step

## Directives

- `matStepperNext` — advance to next step
- `matStepperPrevious` — go back

## Rules / gotchas

- For `linear` mode, every step must have a `[stepControl]` form (or `[completed]` flag) — otherwise users can't proceed.
- `mat-step` content is lazy-rendered by default — guard against `ViewChild` queries until step is visited.
- For multi-page flows that navigate via router, prefer `mat-tab-nav-bar` with router state — stepper is for in-place wizards.
- Don't mix `mat-stepper` with `mat-tabs` for the same flow — pick one navigation paradigm.
- Vertical stepper works well for mobile / narrow viewports (>600px breakpoint).
