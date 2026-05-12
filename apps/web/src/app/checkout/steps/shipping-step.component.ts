import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import type { ShippingMethodId } from '@shopstream/shared-types';
import { injectCheckoutStore } from '../checkout.store.js';
import { SHIPPING_METHODS } from '../shipping-methods.js';

@Component({
  selector: 'ss-shipping-step',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatRadioModule],
  template: `
    <div class="ss-step">
      <h2 class="ss-step__title">Shipping method</h2>
      <mat-radio-group [formControl]="method" aria-label="Shipping method" class="ss-radio-group">
        @for (opt of options; track opt.value) {
          <mat-card class="ss-radio-card" [class.ss-radio-card--selected]="method.value === opt.value">
            <mat-card-content>
              <mat-radio-button [value]="opt.value">
                <div class="ss-radio-card__body">
                  <span class="ss-radio-card__label">{{ opt.label }}</span>
                  <span class="ss-radio-card__desc">{{ opt.description }}</span>
                </div>
              </mat-radio-button>
              <span class="ss-radio-card__trailing">{{ opt.trailing }}</span>
            </mat-card-content>
          </mat-card>
        }
      </mat-radio-group>
      <div class="ss-step__actions">
        <button mat-stroked-button type="button" (click)="back()">Back</button>
        <button mat-flat-button color="primary" type="button" [disabled]="!method.value" (click)="onSubmit()">Continue to payment</button>
      </div>
    </div>
  `,
  styles: [
    `
      .ss-step { display: flex; flex-direction: column; gap: 16px; }
      .ss-step__title { margin: 0 0 8px; font-size: 24px; font-weight: 600; }
      .ss-step__actions { margin-top: 16px; display: flex; justify-content: space-between; }
      .ss-radio-group { display: flex; flex-direction: column; gap: 8px; }
      .ss-radio-card mat-card-content { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
      .ss-radio-card__body { display: inline-flex; flex-direction: column; }
      .ss-radio-card__label { font-weight: 600; }
      .ss-radio-card__desc { font-size: 13px; color: rgba(0,0,0,0.6); }
      .ss-radio-card__trailing { font-weight: 600; font-variant-numeric: tabular-nums; }
      .ss-radio-card--selected { border: 2px solid var(--mat-sys-primary, #006a6a); }
    `,
  ],
})
export class ShippingStepComponent {
  private readonly store = injectCheckoutStore();
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly method = new FormControl<ShippingMethodId | null>(this.store.shippingMethod());
  protected readonly options = SHIPPING_METHODS.map((m) => ({
    value: m.value,
    label: m.label,
    description: m.description,
    trailing: m.trailing,
  }));

  constructor() {
    this.method.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value) this.store.setShippingMethod(value);
      });
  }

  back(): void {
    this.router.navigate(['/checkout/address']);
  }

  onSubmit(): void {
    if (!this.method.value) return;
    this.store.setShippingMethod(this.method.value);
    this.router.navigate(['/checkout/payment']);
  }
}
