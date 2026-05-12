import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import type { ShippingMethodId } from '@shopstream/shared-types';
import { CartStore } from '../../cart/cart.store.js';
import { injectCheckoutStore } from '../checkout.store.js';
import { DISCOUNT_CITY, DISCOUNT_PERCENT, SAUDI_CITIES } from '../saudi-cities.js';

@Component({
  selector: 'ss-guest-shipping-payment-step',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
  ],
  template: `
    <form [formGroup]="addrForm" (ngSubmit)="onSubmit()" class="ss-step">
      <h2 class="ss-step__title">Shipping &amp; payment</h2>

      <mat-form-field appearance="outline">
        <mat-label>Full name</mat-label>
        <input matInput formControlName="fullName" autocomplete="name" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Street address</mat-label>
        <input matInput formControlName="line1" autocomplete="address-line1" />
      </mat-form-field>
      <div class="ss-step__row">
        <mat-form-field appearance="outline">
          <mat-label>City</mat-label>
          <mat-select formControlName="city">
            @for (c of cities; track c.value) {
              <mat-option [value]="c.value">{{ c.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>State / region</mat-label>
          <input matInput formControlName="region" autocomplete="address-level1" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Postal code</mat-label>
          <input matInput formControlName="postalCode" autocomplete="postal-code" />
        </mat-form-field>
      </div>

      @if (jeddahSelected()) {
        <mat-card class="ss-banner" data-tone="success">
          <mat-card-content>
            <mat-icon>check_circle</mat-icon>
            <div><strong>10% Jeddah discount applied</strong><p>We've taken 10% off your cart total.</p></div>
          </mat-card-content>
        </mat-card>
      }

      <h3 class="ss-step__subhead">Shipping method</h3>
      <mat-radio-group [formControl]="method" aria-label="Shipping method" class="ss-radio-group">
        @for (m of methods; track m.value) {
          <mat-card class="ss-radio-card" [class.ss-radio-card--selected]="method.value === m.value">
            <mat-card-content>
              <mat-radio-button [value]="m.value">
                <div class="ss-radio-card__body">
                  <span class="ss-radio-card__label">{{ m.label }}</span>
                  <span class="ss-radio-card__desc">{{ m.description }}</span>
                </div>
              </mat-radio-button>
              <span class="ss-radio-card__trailing">{{ m.trailing }}</span>
            </mat-card-content>
          </mat-card>
        }
      </mat-radio-group>

      <h3 class="ss-step__subhead">Payment</h3>
      <p class="ss-step__hint">
        Your card details are encrypted by our payment partner and never stored on ShopStream servers.
      </p>
      <mat-form-field appearance="outline">
        <mat-label>Payment token</mat-label>
        <input matInput [formControl]="token" autocomplete="off" />
        <mat-hint>Sandbox value, prefix tok_</mat-hint>
      </mat-form-field>

      <div class="ss-step__actions">
        <a routerLink="/checkout/guest/contact">← Back</a>
        <button mat-flat-button color="primary" type="submit" [disabled]="!canContinue()">Review order</button>
      </div>
    </form>
  `,
  styles: [
    `
      .ss-step { display: flex; flex-direction: column; gap: 8px; }
      .ss-step__title { margin: 0 0 8px; font-size: 24px; font-weight: 600; }
      .ss-step__subhead { margin: 16px 0 0; font-size: 18px; font-weight: 600; }
      .ss-step__hint { margin: 0; font-size: 14px; color: rgba(0,0,0,0.6); }
      .ss-step__row { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; }
      .ss-step__actions { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; }
      mat-form-field { width: 100%; }
      .ss-banner mat-card-content { display: flex; gap: 12px; padding: 12px; }
      .ss-banner p { margin: 4px 0 0; }
      .ss-banner[data-tone='success'] { background: #e7f5ec; }
      .ss-banner[data-tone='success'] mat-icon { color: #1a7a4c; }
      .ss-radio-group { display: flex; flex-direction: column; gap: 8px; }
      .ss-radio-card mat-card-content { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
      .ss-radio-card__body { display: inline-flex; flex-direction: column; }
      .ss-radio-card__label { font-weight: 600; }
      .ss-radio-card__desc { font-size: 13px; color: rgba(0,0,0,0.6); }
      .ss-radio-card__trailing { font-weight: 600; font-variant-numeric: tabular-nums; }
      .ss-radio-card--selected { border: 2px solid var(--mat-sys-primary, #006a6a); }
      @media (max-width: 640px) { .ss-step__row { grid-template-columns: 1fr; } }
    `,
  ],
})
export class GuestShippingPaymentStepComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = injectCheckoutStore();
  private readonly cartStore = inject(CartStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly cities = SAUDI_CITIES;

  protected readonly addrForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    line1: ['', Validators.required],
    city: ['', Validators.required],
    region: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['SA'],
  });

  protected readonly method = new FormControl<ShippingMethodId | null>(
    this.store.shippingMethod() ?? 'standard',
  );
  protected readonly token = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^tok_/)],
  });

  protected readonly methods = [
    { value: 'standard' as const, label: 'Standard', description: '5–7 business days', trailing: 'Free' },
    { value: 'express' as const, label: 'Express', description: '2 business days', trailing: '$9.99' },
  ];

  protected jeddahSelected(): boolean {
    return this.addrForm.controls.city.value === DISCOUNT_CITY;
  }

  constructor() {
    this.addrForm.controls.city.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((city) => {
        this.cartStore.setDiscountPercent(city === DISCOUNT_CITY ? DISCOUNT_PERCENT : 0);
      });
    this.method.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value) this.store.setShippingMethod(value);
      });
  }

  canContinue(): boolean {
    return this.addrForm.valid && !!this.method.value && this.token.valid;
  }

  onSubmit(): void {
    if (!this.canContinue()) return;
    this.store.setShippingAddress({ ...this.addrForm.getRawValue() });
    this.store.setShippingMethod(this.method.value!);
    this.store.setPaymentToken(this.token.value);
    this.router.navigate(['/checkout/guest/review']);
  }
}
