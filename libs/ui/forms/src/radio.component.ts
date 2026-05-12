import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** 18x18 circle, ink-bordered. Selected: 9px ink dot. */
@Component({
  selector: 'ss-radio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="ss-radio" [class.ss-radio--checked]="checked" aria-hidden="true">
      @if (checked) {
        <span class="ss-radio__dot"></span>
      }
    </span>
  `,
  styles: [
    `
      :host { display: inline-flex; }
      .ss-radio {
        flex-shrink: 0;
        width: 18px; height: 18px;
        border: 1px solid var(--color-ink);
        border-radius: 9999px;
        background: var(--color-canvas);
        display: flex; align-items: center; justify-content: center;
      }
      .ss-radio__dot {
        width: 9px; height: 9px;
        border-radius: 9999px;
        background: var(--color-ink);
      }
    `,
  ],
})
export class RadioComponent {
  @Input() checked = false;
}
