import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CartStore } from '../../cart/cart.store.js';
import { injectCheckoutStore } from '../checkout.store.js';
import { DISCOUNT_CITY, DISCOUNT_PERCENT, SAUDI_CITIES } from '../saudi-cities.js';

@Component({
  selector: 'ss-address-step',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="ss-step">
      <h2 class="ss-step__title">Shipping address</h2>

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
          <input matInput formControlName="postalCode" inputmode="text" autocomplete="postal-code" />
        </mat-form-field>
      </div>

      @if (jeddahSelected()) {
        <mat-card class="ss-banner" data-tone="success">
          <mat-card-content>
            <mat-icon>check_circle</mat-icon>
            <div>
              <strong>10% Jeddah discount applied</strong>
              <p>We've taken 10% off your cart total.</p>
            </div>
          </mat-card-content>
        </mat-card>
      }

      <div class="ss-step__actions">
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Continue to shipping</button>
      </div>
    </form>
  `,
  styles: [
    `
      :host { display: block; }
      .ss-step { display: flex; flex-direction: column; gap: 8px; }
      .ss-step__title { margin: 0 0 8px; font-size: 24px; font-weight: 600; }
      .ss-step__row { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; }
      .ss-step__actions { margin-top: 16px; display: flex; justify-content: flex-end; }
      mat-form-field { width: 100%; }
      .ss-banner mat-card-content { display: flex; gap: 12px; padding: 12px; }
      .ss-banner p { margin: 4px 0 0; }
      .ss-banner[data-tone='success'] { background: #e7f5ec; }
      .ss-banner[data-tone='success'] mat-icon { color: #1a7a4c; }
      @media (max-width: 640px) { .ss-step__row { grid-template-columns: 1fr; } }
    `,
  ],
})
export class AddressStepComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = injectCheckoutStore();
  private readonly cartStore = inject(CartStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly cities = SAUDI_CITIES;

  protected readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    line1: ['', [Validators.required]],
    city: ['', [Validators.required]],
    region: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
    country: ['SA'],
  });

  protected jeddahSelected(): boolean {
    return this.form.controls.city.value === DISCOUNT_CITY;
  }

  constructor() {
    this.form.controls.city.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((city) => {
        this.cartStore.setDiscountPercent(city === DISCOUNT_CITY ? DISCOUNT_PERCENT : 0);
      });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.store.setShippingAddress({ ...this.form.getRawValue() });
    this.router.navigate(['/checkout/shipping']);
  }
}
