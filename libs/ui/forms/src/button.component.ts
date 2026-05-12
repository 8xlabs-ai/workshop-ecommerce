import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonType = 'button' | 'submit';

/**
 * The single button component in ShopStream. Pass variant.
 * Do NOT reach for a pill — the scaffold has no pill-rounded button.
 */
@Component({
  selector: 'ss-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [attr.data-variant]="variant"
      class="ss-btn"
    >
      <ng-content />
    </button>
  `,
  styles: [
    `
      :host { display: inline-flex; }
      .ss-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 10px 20px;
        font-size: 15px;
        font-weight: 600;
        line-height: 1.25;
        border-radius: var(--rounded-sm);
        cursor: pointer;
        transition: background 120ms ease, border-color 120ms ease;
        font-family: inherit;
      }
      .ss-btn[data-variant='primary'] {
        background: var(--color-primary);
        color: var(--color-on-primary);
        border: 1px solid var(--color-primary);
      }
      .ss-btn[data-variant='primary']:hover { background: var(--color-primary-active); border-color: var(--color-primary-active); }
      .ss-btn[data-variant='primary']:disabled { background: var(--color-primary-disabled); border-color: var(--color-primary-disabled); cursor: not-allowed; }

      .ss-btn[data-variant='secondary'] {
        background: var(--color-canvas);
        color: var(--color-ink);
        border: 1px solid var(--color-ink);
      }
      .ss-btn[data-variant='secondary']:disabled { color: var(--color-muted); border-color: var(--color-border-strong); cursor: not-allowed; }

      .ss-btn[data-variant='tertiary'] {
        background: transparent;
        color: var(--color-ink);
        border: none;
        padding: 8px 4px;
        text-decoration: none;
        min-height: 32px;
      }
      .ss-btn[data-variant='tertiary']:hover { text-decoration: underline; text-underline-offset: 2px; }

      .ss-btn[data-variant='danger'] {
        background: var(--color-error);
        color: var(--color-on-primary);
        border: 1px solid var(--color-error);
      }
    `,
  ],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() type: ButtonType = 'button';
  @Input() disabled = false;
}
