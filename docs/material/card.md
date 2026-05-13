# MatCardModule

Surface container. In this project, used mainly for the **radio-card pattern** (selectable cards wrapping `mat-radio-button`) on shipping + payment steps.

## Import

```ts
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [MatCardModule],
})
```

## Directives

| Selector | Purpose |
|----------|---------|
| `mat-card` | Container |
| `mat-card-header` | Header row |
| `mat-card-title` | Title text |
| `mat-card-subtitle` | Subtitle text |
| `mat-card-content` | Body padding |
| `mat-card-actions` | Action bar (buttons) |
| `mat-card-footer` | Footer |
| `mat-card-image` | Edge-to-edge media |

## Example from project — radio card

`shipping-step.component.ts`:

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
        <span class="ss-radio-card__trailing">{{ opt.trailing }}</span>
      </mat-card-content>
    </mat-card>
  }
</mat-radio-group>
```

Styling hook for selected state:

```css
.ss-radio-card--selected { border: 2px solid var(--mat-sys-primary, #006a6a); }
.ss-radio-card mat-card-content { padding: 12px 16px; }
```

## Rules / gotchas

- Default `mat-card-content` padding is generous — override when nesting interactive controls.
- For selectable cards, drive the visual state from form value (`[class.--selected]="ctrl.value === opt"`), not from click handlers.
- Don't put a `<button>` *around* a `mat-card` — instead put click targets *inside*.
