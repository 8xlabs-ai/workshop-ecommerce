import { ChangeDetectionStrategy, Component, forwardRef, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioComponent } from './radio.component.js';

export interface RadioCardOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  trailing?: string;
}

/**
 * Selectable card wrapping a radio.
 * Selected state: 2px ink border + primary-soft fill.
 * Used for shipping options and payment methods.
 */
@Component({
  selector: 'ss-radio-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RadioComponent],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioCardComponent), multi: true },
  ],
  template: `
    <div class="ss-radio-card-group" role="radiogroup" [attr.aria-label]="ariaLabel">
      @for (opt of options; track opt.value) {
        <label class="ss-radio-card" [class.ss-radio-card--selected]="selected() === opt.value">
          <input
            type="radio"
            class="ss-radio-card__input"
            [value]="opt.value"
            [checked]="selected() === opt.value"
            (change)="select(opt.value)"
          />
          <ss-radio [checked]="selected() === opt.value" />
          <span class="ss-radio-card__body">
            <span class="ss-radio-card__label">{{ opt.label }}</span>
            @if (opt.description) {
              <span class="ss-radio-card__description">{{ opt.description }}</span>
            }
          </span>
          @if (opt.trailing) {
            <span class="ss-radio-card__trailing">{{ opt.trailing }}</span>
          }
        </label>
      }
    </div>
  `,
  styles: [
    `
      .ss-radio-card-group { display: flex; flex-direction: column; gap: 8px; }
      .ss-radio-card {
        display: flex; align-items: center; gap: 12px;
        padding: 16px;
        background: var(--color-canvas);
        border: 1px solid var(--color-hairline);
        border-radius: var(--rounded-md);
        cursor: pointer;
      }
      .ss-radio-card--selected {
        border-width: 2px;
        border-color: var(--color-ink);
        background: var(--color-primary-soft);
        padding: 15px;
      }
      .ss-radio-card__input { position: absolute; opacity: 0; pointer-events: none; }
      .ss-radio-card__body { display: flex; flex-direction: column; flex: 1; gap: 2px; }
      .ss-radio-card__label { font-size: 16px; font-weight: 600; color: var(--color-ink); }
      .ss-radio-card__description { font-size: 14px; color: var(--color-muted); }
      .ss-radio-card__trailing { font-size: 16px; font-weight: 600; color: var(--color-ink); font-variant-numeric: tabular-nums; flex-shrink: 0; }
    `,
  ],
})
export class RadioCardComponent<T extends string = string> implements ControlValueAccessor {
  @Input({ required: true }) options: RadioCardOption<T>[] = [];
  @Input() ariaLabel = '';

  protected readonly selected = signal<T | null>(null);

  private onChange: (v: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: T | null): void {
    this.selected.set(value);
  }
  registerOnChange(fn: (v: T | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  select(value: T): void {
    this.selected.set(value);
    this.onChange(value);
    this.onTouched();
  }
}
