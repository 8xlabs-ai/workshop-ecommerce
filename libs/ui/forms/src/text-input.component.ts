import { ChangeDetectionStrategy, Component, forwardRef, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type TextInputType = 'text' | 'email' | 'tel' | 'password' | 'number';

/**
 * White surface, 1px hairline, 6px radius, 44px height (48px on mobile).
 * Focus state: 2px ink border, no glow.
 * Error state: 1px error-color border; label color does NOT turn red.
 */
@Component({
  selector: 'ss-text-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextInputComponent), multi: true },
  ],
  template: `
    <input
      class="ss-text-input"
      [type]="type"
      [placeholder]="placeholder"
      [value]="value()"
      [disabled]="disabled()"
      [attr.inputmode]="inputmode"
      [attr.autocomplete]="autocomplete"
      [attr.aria-invalid]="hasError ? 'true' : null"
      [class.ss-text-input--error]="hasError"
      (input)="onInput($any($event.target).value)"
      (blur)="onBlur()"
    />
  `,
  styles: [
    `
      :host { display: block; }
      .ss-text-input {
        display: block;
        width: 100%;
        height: 44px;
        padding: 0 14px;
        background: var(--color-canvas);
        color: var(--color-ink);
        font-family: inherit;
        font-size: 16px;
        line-height: 1.5;
        border: 1px solid var(--color-hairline);
        border-radius: var(--rounded-sm);
        outline: none;
        transition: border-color 120ms ease, padding 120ms ease;
      }
      .ss-text-input::placeholder { color: var(--color-muted-soft); }
      .ss-text-input:focus {
        border: 2px solid var(--color-ink);
        padding: 0 13px;
      }
      .ss-text-input--error { border-color: var(--color-error); }
      .ss-text-input:disabled { background: var(--color-surface-soft); color: var(--color-muted); }

      @media (max-width: 640px) {
        .ss-text-input { height: 48px; }
      }
    `,
  ],
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() type: TextInputType = 'text';
  @Input() placeholder = '';
  @Input() inputmode?: 'text' | 'email' | 'tel' | 'numeric';
  @Input() autocomplete?: string;
  @Input() hasError = false;

  protected readonly value = signal('');
  protected readonly disabled = signal(false);

  private onChange: (v: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onInput(v: string): void {
    this.value.set(v);
    this.onChange(v);
  }
  onBlur(): void {
    this.onTouched();
  }
}
