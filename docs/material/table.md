# MatTableModule

Tabular data with sort/select/expand support. Use for **price tier comparison tables**, order summaries, and any row-oriented dataset.

## Import

```ts
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@Component({
  standalone: true,
  imports: [MatTableModule, MatSortModule],
})
```

## Core directives

| Directive | Purpose |
|-----------|---------|
| `mat-table [dataSource]` | Table root, takes array or `MatTableDataSource` |
| `matColumnDef="key"` | Column definition |
| `mat-header-cell` / `mat-cell` | Header + body cells |
| `mat-header-row` / `mat-row` | Row templates |
| `[matSortActive]` / `mat-sort-header` | Optional sort |

## Inputs

- `dataSource`: `T[]` or `MatTableDataSource<T>`
- `displayedColumns`: `string[]` — column keys to render, in order
- `multiTemplateDataRows`: enable expandable rows

## Example — price tier comparison

```ts
displayedColumns = ['feature', 'starter', 'pro', 'enterprise'];
tierRows = [
  { feature: 'Users',     starter: '1',    pro: '10',   enterprise: 'Unlimited' },
  { feature: 'Storage',   starter: '5 GB', pro: '50 GB',enterprise: '500 GB' },
  { feature: 'SSO',       starter: '—',    pro: '✓',    enterprise: '✓' },
];
```

```html
<table mat-table [dataSource]="tierRows" class="ss-tier-table">
  <ng-container matColumnDef="feature">
    <th mat-header-cell *matHeaderCellDef>Feature</th>
    <td mat-cell *matCellDef="let row">{{ row.feature }}</td>
  </ng-container>
  <ng-container matColumnDef="starter">
    <th mat-header-cell *matHeaderCellDef>Starter</th>
    <td mat-cell *matCellDef="let row">{{ row.starter }}</td>
  </ng-container>
  <!-- pro, enterprise columns similarly -->
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
</table>
```

## Rules / gotchas

- `displayedColumns` order = column render order. Keep array order intentional.
- `dataSource` must change reference (not mutate) for table to re-render unless using `MatTableDataSource`.
- Use `trackBy` on large tables: `<tr mat-row *matRowDef="let row; columns: cols; trackBy: trackById"></tr>`.
- For expandable rows, set `multiTemplateDataRows="true"` and define a second row template with detail content.
- Don't use `mat-table` for layout — it's for tabular data only. Reach for CSS grid otherwise.
