# MatCheckboxModule

Single boolean checkbox. Always use with Reactive Forms in this project.

## Import

```ts
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule],
})
```

## Inputs

- `color`: `'primary' | 'accent' | 'warn'` (default primary)
- `disabled`: boolean
- `indeterminate`: boolean — three-state checkbox
- `labelPosition`: `'before' | 'after'`
- `required`: boolean

## Output

- `(change)` — emits `MatCheckboxChange { checked, source }`

## Examples from project

**With `formControlName`** — `guest-contact-step.component.ts`:

```html
<mat-checkbox formControlName="marketingOptIn">
  Email me with news and offers — unsubscribe any time.
</mat-checkbox>
```

Bound to:

```ts
this.form = this.fb.nonNullable.group({
  marketingOptIn: [false],
});
```

**With standalone `FormControl`** — `payment-step.component.ts`:

```ts
protected readonly save = new FormControl<boolean>(false, { nonNullable: true });
```

```html
<mat-checkbox [formControl]="save">Save this card for future orders</mat-checkbox>
```

## Rules / gotchas

- Always default to `false` in `nonNullable` form groups — never `null`.
- Place the label inside the `<mat-checkbox>` tag; don't use a separate `<label>`.
- For groups of related checkboxes, use one `FormControl` per option (Material has no `mat-checkbox-group`).
