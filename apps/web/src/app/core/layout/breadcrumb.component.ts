import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface BreadcrumbStep {
  label: string;
  active?: boolean;
}

/**
 * Horizontal row of muted labels separated by " · ". Active step in ink.
 *
 * **Brownfield note** — this is the checkout step indicator today.
 * The solution-side design wants real pill segments — out of scope here.
 * Do NOT replace; add `aria-current="step"` only if it doesn't widen scope.
 */
@Component({
  selector: 'ss-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="ss-breadcrumb" aria-label="Checkout progress">
      @for (s of steps; track s.label; let last = $last) {
        <span
          class="ss-breadcrumb__step"
          [class.ss-breadcrumb__step--active]="s.active"
          [attr.aria-current]="s.active ? 'step' : null"
        >{{ s.label }}</span>
        @if (!last) {
          <span class="ss-breadcrumb__sep" aria-hidden="true">·</span>
        }
      }
    </nav>
  `,
  styles: [
    `
      .ss-breadcrumb {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .ss-breadcrumb__step {
        font-size: 14px;
        line-height: 1.43;
        color: var(--color-muted);
      }
      .ss-breadcrumb__step--active {
        color: var(--color-ink);
        font-weight: 600;
      }
      .ss-breadcrumb__sep {
        color: var(--color-muted);
      }
    `,
  ],
})
export class BreadcrumbComponent {
  @Input({ required: true }) steps: BreadcrumbStep[] = [];
}
