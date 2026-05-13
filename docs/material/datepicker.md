# MatDatepickerModule

Calendar date picker tied to an input field. Use for **subscription start dates**, delivery date selection, scheduling.

## Import

```ts
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,         // OR MatMomentDateModule / MatLuxonDateModule
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
```

> **Date adapter required.** `MatNativeDateModule` is the simplest (uses `Date`). For Luxon/Moment, use the corresponding adapter package.

## Pattern

```html
<mat-form-field appearance="outline">
  <mat-label>Start date</mat-label>
  <input matInput [matDatepicker]="picker" [formControl]="startDate" />
  <mat-datepicker-toggle matIconSuffix [for]="picker" />
  <mat-datepicker #picker />
</mat-form-field>
```

## Inputs

- `[matDatepicker]`: reference to `mat-datepicker` template var
- `[min]` / `[max]`: Date — bound the selectable range
- `[matDatepickerFilter]`: `(d: Date) => boolean` — disable specific dates
- `mat-datepicker [startView]`: `'month' | 'year' | 'multi-year'`
- `mat-datepicker [touchUi]`: boolean — mobile-style full-screen picker

## Example — subscription start

```ts
today = new Date();
maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));
startDate = new FormControl<Date | null>(this.today);
```

```html
<mat-form-field appearance="outline">
  <mat-label>Subscription start</mat-label>
  <input matInput [matDatepicker]="picker"
         [min]="today" [max]="maxDate"
         [formControl]="startDate" />
  <mat-hint>Must be within the next 3 months</mat-hint>
  <mat-datepicker-toggle matIconSuffix [for]="picker" />
  <mat-datepicker #picker />
</mat-form-field>
```

## Date range picker

```html
<mat-form-field appearance="outline">
  <mat-label>Trial period</mat-label>
  <mat-date-range-input [rangePicker]="rangePicker">
    <input matStartDate [formControl]="trialStart" placeholder="Start" />
    <input matEndDate   [formControl]="trialEnd"   placeholder="End" />
  </mat-date-range-input>
  <mat-datepicker-toggle matIconSuffix [for]="rangePicker" />
  <mat-date-range-picker #rangePicker />
</mat-form-field>
```

## Rules / gotchas

- ALWAYS provide a date adapter (`MatNativeDateModule`, `MatMomentDateModule`, or `MatLuxonDateModule`). Without one, the picker silently fails to open.
- `[min]` / `[max]` accept `Date` objects, not strings. Parse strings before binding.
- Use `[matDatepickerFilter]` for non-contiguous disabled dates (e.g. weekends only).
- `touchUi="true"` for mobile — feels more native than the dropdown calendar on small screens.
- Validate the form: an empty datepicker emits `null` — handle that explicitly in your form validators.
