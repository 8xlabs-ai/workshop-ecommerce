import { ChangeDetectionStrategy, Component, forwardRef, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Plus/minus quantity stepper.
 * Emits 0 when the user decrements past `min` (caller decides whether
 * to delete the row). 32x32 circular buttons match the scaffold spec.
 */
@Component({
  selector: 'ss-quantity-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuantityStepperComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ss-stepper">
      <button
        type="button"
        class="ss-stepper__btn"
        [disabled]="disabled() || quantity() === 0"
        [attr.aria-label]="quantity() <= min ? 'Remove from cart' : 'Decrease quantity'"
        (click)="decrement()"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
        </svg>
      </button>
      <span class="ss-stepper__value" aria-live="polite">{{ quantity() }}</span>
      <button
        type="button"
        class="ss-stepper__btn"
        [disabled]="disabled() || quantity() >= max"
        aria-label="Increase quantity"
        (click)="increment()"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  `,
  styles: [
    `
      :host { display: inline-flex; }
      .ss-stepper {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: var(--color-canvas);
        border-radius: var(--rounded-xs);
      }
      .ss-stepper__btn {
        width: 32px;
        height: 32px;
        border-radius: 9999px;
        background: var(--color-surface-strong);
        color: var(--color-ink);
        border: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 120ms ease;
      }
      .ss-stepper__btn svg { width: 16px; height: 16px; }
      .ss-stepper__btn:hover:not(:disabled) {
        background: var(--color-hairline);
      }
      .ss-stepper__btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .ss-stepper__value {
        min-width: 24px;
        text-align: center;
        font-size: 15px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        color: var(--color-ink);
      }
    `,
  ],
})
export class QuantityStepperComponent implements ControlValueAccessor {
  @Input() min = 1;
  @Input() max = 20;

  protected readonly quantity = signal(1);
  protected readonly disabled = signal(false);

  private onChange: (value: number) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: number | null): void {
    this.quantity.set(value ?? 0);
  }
  registerOnChange(fn: (v: number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  decrement(): void {
    const next = this.quantity() - 1;
    const clamped = next < this.min ? 0 : next;
    this.quantity.set(clamped);
    this.onChange(clamped);
    this.onTouched();
  }

  increment(): void {
    if (this.quantity() >= this.max) return;
    const next = this.quantity() + 1;
    this.quantity.set(next);
    this.onChange(next);
    this.onTouched();
  }
}
