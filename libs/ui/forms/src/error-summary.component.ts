import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface ErrorSummaryItem {
  field: string;
  message: string;
}

@Component({
  selector: 'ss-error-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (errors.length > 0) {
      <div class="ss-error-summary" role="alert" aria-live="polite">
        <h2 class="ss-error-summary__title">There's a problem with your submission</h2>
        <ul class="ss-error-summary__list">
          @for (e of errors; track e.field) {
            <li>
              <a [attr.href]="'#' + e.field">{{ e.message }}</a>
            </li>
          }
        </ul>
      </div>
    }
  `,
  styles: [
    `
      .ss-error-summary {
        padding: 16px 20px;
        background: var(--color-error-soft);
        border: 1px solid var(--color-error);
        border-radius: var(--rounded-md);
      }
      .ss-error-summary__title {
        margin: 0 0 8px;
        font-size: 16px;
        font-weight: 600;
        color: var(--color-error);
      }
      .ss-error-summary__list {
        margin: 0;
        padding-left: 20px;
        color: var(--color-error);
      }
      .ss-error-summary__list a {
        color: inherit;
        text-decoration: underline;
      }
    `,
  ],
})
export class ErrorSummaryComponent {
  @Input() errors: ErrorSummaryItem[] = [];
}
