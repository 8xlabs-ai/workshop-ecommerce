import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ss-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="ss-page-header">
      <h1 class="ss-page-header__title">{{ title }}</h1>
      @if (description) {
        <p class="ss-page-header__description">{{ description }}</p>
      }
    </header>
  `,
  styles: [
    `
      .ss-page-header {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .ss-page-header__title {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        line-height: 30px;
        letter-spacing: -0.2px;
        color: var(--color-ink);
      }
      .ss-page-header__description {
        margin: 0;
        font-size: 16px;
        line-height: 24px;
        color: var(--color-body);
      }
    `,
  ],
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() description?: string;
}
