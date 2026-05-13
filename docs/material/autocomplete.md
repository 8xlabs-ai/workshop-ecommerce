# MatAutocompleteModule

Typeahead input with dropdown of matching options. Use for **product search**, country pickers, customer lookups.

## Import

```ts
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [MatAutocompleteModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
})
```

## Pattern

```html
<mat-form-field appearance="outline">
  <mat-label>Country</mat-label>
  <input matInput [formControl]="countryCtrl" [matAutocomplete]="auto" />
  <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayCountry">
    <mat-option *ngFor="let c of filtered$ | async" [value]="c">
      {{ c.name }}
    </mat-option>
  </mat-autocomplete>
</mat-form-field>
```

## TypeScript wiring

```ts
countryCtrl = new FormControl<Country | string>('');

filtered$ = this.countryCtrl.valueChanges.pipe(
  startWith(''),
  map((value) => typeof value === 'string' ? value : value?.name ?? ''),
  map((name) => this.countries.filter((c) =>
    c.name.toLowerCase().startsWith(name.toLowerCase())
  )),
);

displayCountry = (c: Country | null) => c?.name ?? '';
```

## Inputs

- `mat-autocomplete [displayWith]`: `(value: T) => string` — how to render selected object as input text
- `mat-autocomplete [autoActiveFirstOption]`: boolean — highlight first option
- `mat-autocomplete [panelWidth]`: string | number
- `[matAutocompletePosition]`: `'auto' | 'above' | 'below'`

## Rules / gotchas

- `[displayWith]` is critical when options are objects (not strings) — without it the input shows `[object Object]`.
- Use `startWith('')` on the filtered observable so the dropdown shows initial options.
- Debounce typing with `debounceTime(200)` when the filter is server-side.
- Setting the form value to an object emits `valueChanges` with that object — handle both string (typing) and object (selected) states in your filter logic.
- For free-text-OK inputs, validate against the option list separately — autocomplete doesn't enforce selection.
