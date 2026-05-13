# MatSnackBar

Transient toast notifications. Injected as a service — there's no template directive.

> **Project note:** for in-page inline feedback we use `libs/ui/feedback` (`ToastService` + `inline-banner`). `MatSnackBar` is for short, transient OS-level toasts (e.g. "added to cart"). Don't use it for form validation errors — use `mat-error` instead.

## Import & inject

```ts
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({ standalone: true, imports: [] })
export class MyComponent {
  private readonly snackBar = inject(MatSnackBar);
}
```

> No module import is needed in the `imports` array for `.open(...)`. Add `MatSnackBarModule` only if you use directives like `<mat-snack-bar-container>`.

## API — `open()`

```ts
snackBar.open(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<...>;
```

### Common `MatSnackBarConfig` options

| Option | Purpose |
|--------|---------|
| `duration` | Auto-dismiss in ms (e.g. `3000`). `0` = sticky |
| `panelClass` | Class(es) on the snackbar surface |
| `horizontalPosition` | `'start'` `'center'` `'end'` `'left'` `'right'` |
| `verticalPosition` | `'top'` `'bottom'` |
| `politeness` | `'polite'` `'assertive'` `'off'` (a11y live region) |

## Examples from project

`catalog-page.component.ts`:

```ts
private readonly snackBar = inject(MatSnackBar);

addToCart(p: ProductSummary) {
  if (!this.auth.isAuthenticated()) {
    this.snackBar.open('Sign in or check out as a guest to add items.', 'Dismiss', { duration: 4000 });
    this.router.navigate(['/account/login'], { queryParams: { redirect: '/cart' } });
    return;
  }
  this.cartStore.addItem(p.id, 1);
  this.snackBar.open(`${p.title} added to cart`, 'Dismiss', { duration: 3000 });
}
```

## Advanced

- **Custom component**: `snackBar.openFromComponent(MyToastComponent, { data: {...} })`
- **Programmatic dismiss**: capture the `MatSnackBarRef` and call `.dismiss()`
- **Action click**: subscribe to `ref.onAction()`

## Rules / gotchas

- Always provide `duration` — sticky snackbars (no auto-dismiss) need a manual action button.
- Don't log PII into the snackbar message (it's user-visible but still — order numbers OK, raw emails / addresses no).
- One snackbar at a time — calling `open()` twice replaces the previous.
- Don't use for form errors — `mat-error` belongs inline. Snackbar is for success confirmations or async failures (network errors, etc.).
- Requires `provideAnimationsAsync()` in `app.config.ts` (already wired).
