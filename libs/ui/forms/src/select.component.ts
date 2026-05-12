import { ChangeDetectionStrategy, Component, forwardRef, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

@Component({
  selector: 'ss-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true },
  ],
  template: `
    <div class="ss-select">
      <select
        class="ss-select__native"
        [value]="value() ?? ''"
        [disabled]="disabled()"
        (change)="onSelect($any($event.target).value)"
      >
        @if (placeholder) {
          <option value="" disabled hidden>{{ placeholder }}</option>
        }
        @for (opt of options; track opt.value) {
          <option [value]="opt.value">{{ opt.label }}</option>
        }
      </select>
      <svg class="ss-select__chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  `,
  styles: [
    `
      .ss-select { position: relative; display: block; }
      .ss-select__native {
        appearance: none;
        width: 100%;
        height: 44px;
        padding: 0 36px 0 14px;
        background: var(--color-canvas);
        color: var(--color-ink);
        font-family: inherit;
        font-size: 16px;
        line-height: 1.5;
        border: 1px solid var(--color-hairline);
        border-radius: var(--rounded-sm);
        outline: none;
      }
      .ss-select__native:focus { border: 2px solid var(--color-ink); padding: 0 35px 0 13px; }
      .ss-select__chevron {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-ink);
        pointer-events: none;
      }
    `,
  ],
})
export class SelectComponent<T extends string = string> implements ControlValueAccessor {
  @Input({ required: true }) options: SelectOption<T>[] = [];
  @Input() placeholder?: string;

  protected readonly value = signal<T | null>(null);
  protected readonly disabled = signal(false);

  private onChange: (v: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: T | null): void {
    this.value.set(value);
  }
  registerOnChange(fn: (v: T | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onSelect(v: string): void {
    this.value.set((v as T) || null);
    this.onChange((v as T) || null);
    this.onTouched();
  }
}
