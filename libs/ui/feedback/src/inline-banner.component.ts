import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type BannerTone = 'info' | 'success' | 'warning' | 'error';

/**
 * 1px-hairline-bordered, 12px-radius banner.
 * Small left-edge icon, title, body line, optional right-edge tertiary action.
 *
 * Note: icon is currently decorative (no aria-label) — see design-debt log.
 */
@Component({
  selector: 'ss-inline-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ss-banner" [attr.data-tone]="tone" role="status">
      <div class="ss-banner__icon" aria-hidden="true">
        @switch (tone) {
          @case ('success') { ✓ }
          @case ('warning') { ! }
          @case ('error') { ✕ }
          @default { i }
        }
      </div>
      <div class="ss-banner__body">
        @if (title) {
          <p class="ss-banner__title">{{ title }}</p>
        }
        <p class="ss-banner__text">
          <ng-content />
        </p>
      </div>
      <ng-content select="[slot=action]" />
    </div>
  `,
  styles: [
    `
      .ss-banner {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 16px;
        border: 1px solid var(--color-hairline);
        border-radius: var(--rounded-md);
      }
      .ss-banner[data-tone='info']    { background: var(--color-primary-soft); border-color: var(--color-primary); }
      .ss-banner[data-tone='success'] { background: var(--color-success-soft); border-color: var(--color-success); }
      .ss-banner[data-tone='warning'] { background: var(--color-warning-soft); border-color: var(--color-warning); }
      .ss-banner[data-tone='error']   { background: var(--color-error-soft);   border-color: var(--color-error); }

      .ss-banner__icon {
        flex-shrink: 0;
        width: 20px; height: 20px;
        display: flex; align-items: center; justify-content: center;
        border-radius: 9999px;
        font-size: 12px; font-weight: 700;
        color: var(--color-on-primary);
      }
      .ss-banner[data-tone='info']    .ss-banner__icon { background: var(--color-primary); }
      .ss-banner[data-tone='success'] .ss-banner__icon { background: var(--color-success); }
      .ss-banner[data-tone='warning'] .ss-banner__icon { background: var(--color-warning); }
      .ss-banner[data-tone='error']   .ss-banner__icon { background: var(--color-error); }

      .ss-banner__body { flex: 1; display: flex; flex-direction: column; gap: 2px; }
      .ss-banner__title { margin: 0; font-size: 16px; font-weight: 600; line-height: 1.25; color: var(--color-ink); }
      .ss-banner__text  { margin: 0; font-size: 14px; line-height: 1.43; color: var(--color-body); }
    `,
  ],
})
export class InlineBannerComponent {
  @Input() tone: BannerTone = 'info';
  @Input() title?: string;
}
