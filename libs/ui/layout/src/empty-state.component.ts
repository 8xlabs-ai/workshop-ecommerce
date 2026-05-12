import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ss-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ss-empty-state">
      <h2 class="ss-empty-state__title">{{ title }}</h2>
      @if (description) {
        <p class="ss-empty-state__description">{{ description }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: [
    `
      .ss-empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 56px 24px;
        text-align: center;
      }
      .ss-empty-state__title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: var(--color-ink);
      }
      .ss-empty-state__description {
        margin: 0;
        max-width: 480px;
        color: var(--color-body);
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input({ required: true }) title!: string;
  @Input() description?: string;
}
