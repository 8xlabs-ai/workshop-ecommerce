# MatDialogModule

Modal dialog service. Use for **purchase confirmations**, destructive action confirmations ("Cancel subscription?"), inline forms in a modal.

## Import

```ts
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [MatDialogModule],
})
```

## Service

Inject `MatDialog` and call `.open()`:

```ts
private dialog = inject(MatDialog);

confirmUpgrade() {
  const ref = this.dialog.open(UpgradeConfirmDialogComponent, {
    data: { tier: 'pro', price: 29 },
    width: '420px',
    disableClose: false,
  });
  ref.afterClosed().subscribe((result) => {
    if (result === 'confirm') this.upgrade();
  });
}
```

## Dialog component structure

```ts
@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Upgrade to {{ data.tier }}?</h2>
    <mat-dialog-content>
      <p>You'll be charged ${{ data.price }} per month, starting today.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [mat-dialog-close]="'confirm'">
        Confirm upgrade
      </button>
    </mat-dialog-actions>
  `,
})
export class UpgradeConfirmDialogComponent {
  data = inject<{ tier: string; price: number }>(MAT_DIALOG_DATA);
}
```

## Open options

- `data`: any — injected as `MAT_DIALOG_DATA` token
- `width` / `maxWidth` / `height`
- `disableClose`: boolean — prevent backdrop/Esc close
- `autoFocus`: `'first-tabbable' | 'dialog' | 'first-heading'`
- `restoreFocus`: boolean — restore focus to trigger on close

## Rules / gotchas

- Always inject `MAT_DIALOG_DATA` to receive `data` passed to `.open()`.
- Close via `[mat-dialog-close]="value"` directive OR `dialogRef.close(value)` — the value comes through `afterClosed()`.
- `disableClose` should be used sparingly — only when closing mid-flow would leave dirty state.
- For confirmations, the destructive action goes on the right with `color="warn"` (red) — Material convention.
- Don't open multiple dialogs at once. Use `dialog.closeAll()` to be safe before re-opening.
- Dialog components should be standalone and import `MatDialogModule` themselves.
