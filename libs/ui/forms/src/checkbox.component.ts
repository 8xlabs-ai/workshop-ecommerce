import { ChangeDetectionStrategy, Component, forwardRef, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** 18x18 square, 4px radius, ink-bordered. Selected: ink fill + white check. */
@Component({
  selector: 'ss-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxComponent), multi: true },
  ],
  template: `
    <label class="ss-checkbox">
      <input
        type="checkbox"
        class="ss-checkbox__input"
        [checked]="checked()"
        [disabled]="disabled()"
        (change)="onToggle($any($event.target).checked)"
      />
      <span class="ss-checkbox__box" [class.ss-checkbox__box--checked]="checked()" aria-hidden="true">
        @if (checked()) {
          <svg viewBox="0 0 14 14" width="12" height="12">
            <path d="M3 7l3 3 5-6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        }
      </span>
      <span class="ss-checkbox__label">
        @if (label) {
          {{ label }}
        } @else {
          <ng-content />
        }
      </span>
    </label>
  `,
  styles: [
    `
      .ss-checkbox { display: inline-flex; align-items: flex-start; gap: 12px; cursor: pointer; user-select: none; }
      .ss-checkbox__input { position: absolute; opacity: 0; pointer-events: none; }
      .ss-checkbox__box {
        flex-shrink: 0;
        width: 18px; height: 18px;
        border: 1px solid var(--color-ink);
        border-radius: 4px;
        background: var(--color-canvas);
        display: flex; align-items: center; justify-content: center;
        margin-top: 2px;
      }
      .ss-checkbox__box--checked { background: var(--color-ink); }
      .ss-checkbox__label { font-size: 16px; line-height: 1.5; color: var(--color-ink); }
    `,
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label = '';

  protected readonly checked = signal(false);
  protected readonly disabled = signal(false);

  private onChange: (v: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }
  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onToggle(v: boolean): void {
    this.checked.set(v);
    this.onChange(v);
    this.onTouched();
  }
}
