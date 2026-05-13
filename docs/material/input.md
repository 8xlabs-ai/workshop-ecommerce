# MatInputModule

Provides the `matInput` directive that turns a native `<input>` or `<textarea>` into a Material form-field-compatible control. **Must** be used inside `<mat-form-field>`.

## Import

```ts
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
```

## Usage

`matInput` is a directive on a native `<input>` — keep all native attributes (`type`, `inputmode`, `autocomplete`, `placeholder`).

```html
<mat-form-field appearance="outline">
  <mat-label>Email</mat-label>
  <input matInput formControlName="email" type="email" inputmode="email" autocomplete="email" />
</mat-form-field>
```

## Common native attributes used in project

| Attribute | Why |
|-----------|-----|
| `type` | `text` / `email` / `tel` etc. |
| `inputmode` | Better mobile keyboard (`numeric`, `email`) |
| `autocomplete` | Browser fill (`given-name`, `cc-number`, `cc-exp`, `cc-csc`, `email`) |
| `placeholder` | Hint shown when empty |

## Examples from project

**Email field** — `guest-contact-step.component.ts`:

```html
<input matInput formControlName="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" />
```

**Numeric card fields** — `payment-step.component.ts`:

```html
<input matInput formControlName="number" inputmode="numeric" autocomplete="cc-number" (input)="onNumberInput($event)" />
<input matInput formControlName="expiry" inputmode="numeric" autocomplete="cc-exp" (input)="onExpiryInput($event)" />
<input matInput formControlName="cvv" inputmode="numeric" autocomplete="cc-csc" />
```

For input masking, format inside the `(input)` handler and write back via `setValue(formatted, { emitEvent: false })`:

```ts
onNumberInput(ev: Event): void {
  const target = ev.target as HTMLInputElement;
  const formatted = formatCardNumberInput(target.value);
  target.value = formatted;
  this.form.controls.number.setValue(formatted, { emitEvent: false });
}
```

## Rules / gotchas

- `matInput` only works inside `<mat-form-field>`. Outside it, Material won't style/layout the field.
- Don't put a label *outside* the form field — use `<mat-label>` inside.
- For numeric inputs use `inputmode="numeric"`, not `type="number"` (which adds browser spinners + breaks formatting).
- For payment fields, this project uses local masking + `payx-sdk` for real tokenization (see `payx-client.ts`). Never log or persist raw card data.
- Always set `autocomplete` — improves UX and accessibility.
