# MatTooltipModule

Hover/focus tooltip with text content. Use for **feature explanations** on tier cards ("What is SSO?"), help hints, abbreviation expansions.

## Import

```ts
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [MatTooltipModule],
})
```

## Directive

```html
<element [matTooltip]="'text'" />
```

## Inputs

- `matTooltip`: string — tooltip text (required)
- `matTooltipPosition`: `'above' | 'below' | 'left' | 'right' | 'before' | 'after'`
- `matTooltipShowDelay` / `matTooltipHideDelay`: number (ms)
- `matTooltipDisabled`: boolean
- `matTooltipClass`: custom CSS class for the tooltip element

## Example — feature explanation

```html
<li class="ss-feature">
  Single sign-on
  <mat-icon matTooltip="Sign in using your company's identity provider (SAML, Okta, Azure AD).">
    info_outline
  </mat-icon>
</li>
```

## Example — disabled-button hint

```html
<button mat-flat-button color="primary"
        [disabled]="!form.valid"
        [matTooltip]="form.valid ? '' : 'Fill all required fields first'"
        [matTooltipDisabled]="form.valid">
  Continue
</button>
```

## Rules / gotchas

- Tooltips are **not focusable** themselves — content must be reachable via keyboard. For mobile/touch users, tooltips show on long-press.
- Don't put critical information ONLY in a tooltip — it's progressive enhancement, not primary content.
- Keep text short (one line ideal). For longer help text, use `mat-icon-button` with a `mat-menu` or inline help text instead.
- Tooltips on disabled buttons require `[matTooltipDisabled]` toggling — disabled elements don't receive pointer events natively.
- Avoid tooltips on touch-only flows — they're awkward to invoke.
