# MatRadioModule

Single-select radio group. Always inside a `<mat-radio-group>` bound via Reactive Forms.

## Import

```ts
import { MatRadioModule } from '@angular/material/radio';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatRadioModule],
})
```

## Selectors

| Selector | Purpose |
|----------|---------|
| `<mat-radio-group>` | Container — owns the form value, `aria-label` required |
| `<mat-radio-button>` | One option with `[value]` |

## Inputs

`mat-radio-group`:
- `formControlName` / `[formControl]` — binding
- `color`: `'primary' | 'accent' | 'warn'`
- `name` (auto-generated if omitted)
- `aria-label` / `aria-labelledby`

`mat-radio-button`:
- `[value]` — selected value
- `disabled`

## Examples from project

**Shipping method radio cards** — `shipping-step.component.ts`:

```html
<mat-radio-group [formControl]="method" aria-label="Shipping method" class="ss-radio-group">
  @for (opt of options; track opt.value) {
    <mat-card class="ss-radio-card" [class.ss-radio-card--selected]="method.value === opt.value">
      <mat-card-content>
        <mat-radio-button [value]="opt.value">
          <div class="ss-radio-card__body">
            <span class="ss-radio-card__label">{{ opt.label }}</span>
            <span class="ss-radio-card__desc">{{ opt.description }}</span>
          </div>
        </mat-radio-button>
      </mat-card-content>
    </mat-card>
  }
</mat-radio-group>
```

```css
.ss-radio-group { display: flex; flex-direction: column; gap: 8px; }
```

**Saved-card selector** — `payment-step.component.ts` — same pattern, switching between saved-card values and a sentinel `__new__` value to reveal the new-card form via a `computed()` signal:

```ts
protected readonly showNewCardForm = computed(
  () => !this.savedCards.hasCards() || this.selectionSignal() === NEW_CARD_VALUE,
);
```

## Rules / gotchas

- The group owns the value — bind the form control on `<mat-radio-group>`, not on each button.
- Always set `aria-label` on the group.
- Use a sentinel string value (e.g. `'__new__'`) when one option should reveal a different UI — keeps the form control simple.
- Don't nest interactive elements inside `<mat-radio-button>` — the whole row is the click target.
