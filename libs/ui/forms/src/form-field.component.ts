import { ChangeDetectionStrategy, Component, Input, contentChild } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Wraps any input with a label, optional hint, optional error.
 * **Mandatory** wrapper for inputs — never write a bare `<label>`+`<input>` pair.
 *
 *   <ss-form-field label="Email" hint="We don't share your email.">
 *     <ss-text-input type="email" formControlName="email" />
 *   </ss-form-field>
 */
@Component({
  selector: 'ss-form-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="ss-form-field__label" [for]="inputId">{{ label }}</label>
    <ng-content />
    @if (errorMessage()) {
      <p class="ss-form-field__error" role="alert">{{ errorMessage() }}</p>
    } @else if (hint) {
      <p class="ss-form-field__hint">{{ hint }}</p>
    }
  `,
  styles: [
    `
      :host { display: flex; flex-direction: column; gap: 6px; }
      .ss-form-field__label {
        font-size: 13px;
        font-weight: 500;
        line-height: 1.30;
        color: var(--color-ink);
      }
      .ss-form-field__hint {
        margin: 0;
        font-size: 12px;
        line-height: 1.33;
        color: var(--color-muted);
      }
      .ss-form-field__error {
        margin: 0;
        font-size: 13px;
        line-height: 1.30;
        color: var(--color-error);
      }
    `,
  ],
})
export class FormFieldComponent {
  @Input({ required: true }) label!: string;
  @Input() hint?: string;
  @Input() inputId = `ss-field-${Math.random().toString(36).slice(2, 8)}`;

  private readonly controlRef = contentChild(NgControl);

  errorMessage(): string | null {
    const c = this.controlRef();
    if (!c || !c.touched || !c.errors) return null;
    if (c.errors['required']) return `${this.label} is required.`;
    if (c.errors['email']) return 'Enter a valid email.';
    if (c.errors['minlength']) return `${this.label} is too short.`;
    if (c.errors['pattern']) return `${this.label} format is invalid.`;
    return 'Please correct this field.';
  }
}
