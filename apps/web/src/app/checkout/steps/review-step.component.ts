import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CheckoutService } from '../checkout.service.js';
import { injectCheckoutStore } from '../checkout.store.js';

@Component({
  selector: 'ss-review-step',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <section class="ss-step">
      <h2 class="ss-step__title">Review</h2>

      @if (store.error()) {
        <mat-card class="ss-banner" data-tone="error">
          <mat-card-content>
            <mat-icon>error</mat-icon>
            <div><strong>We couldn't place your order</strong><p>{{ store.error() }}</p></div>
          </mat-card-content>
        </mat-card>
      }

      @if (store.shippingAddress(); as a) {
        <mat-card class="ss-review-card">
          <mat-card-header>
            <mat-card-title>Shipping to</mat-card-title>
            <button mat-button (click)="edit('/checkout/address')">Edit</button>
          </mat-card-header>
          <mat-card-content>
            <p>{{ a.fullName }}<br />{{ a.line1 }}<br />{{ a.city }}, {{ a.region }} {{ a.postalCode }}</p>
          </mat-card-content>
        </mat-card>
      }

      @if (store.shippingMethod()) {
        <mat-card class="ss-review-card">
          <mat-card-header>
            <mat-card-title>Shipping method</mat-card-title>
            <button mat-button (click)="edit('/checkout/shipping')">Edit</button>
          </mat-card-header>
          <mat-card-content>
            <p>{{ store.shippingMethod() }}</p>
          </mat-card-content>
        </mat-card>
      }

      <mat-card class="ss-review-card">
        <mat-card-header>
          <mat-card-title>Payment</mat-card-title>
          <button mat-button (click)="edit('/checkout/payment')">Edit</button>
        </mat-card-header>
        <mat-card-content>
          <p>Sandbox token captured.</p>
        </mat-card-content>
      </mat-card>

      <div class="ss-step__actions">
        <button mat-stroked-button type="button" (click)="edit('/checkout/payment')">Back</button>
        <button mat-flat-button color="primary" type="button" [disabled]="!store.canSubmitLoggedIn() || store.submitting()" (click)="place()">
          @if (store.submitting()) { Placing order… } @else { Place order }
        </button>
      </div>
    </section>
  `,
  styles: [
    `
      .ss-step { display: flex; flex-direction: column; gap: 16px; }
      .ss-step__title { margin: 0 0 8px; font-size: 24px; font-weight: 600; }
      .ss-review-card mat-card-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 16px 0; }
      .ss-review-card mat-card-title { font-size: 16px; font-weight: 600; }
      .ss-review-card p { margin: 0; font-size: 14px; color: rgba(0,0,0,0.7); }
      .ss-banner mat-card-content { display: flex; gap: 12px; padding: 12px; }
      .ss-banner[data-tone='error'] { background: #fde2e2; }
      .ss-banner[data-tone='error'] mat-icon { color: #b91c1c; }
      .ss-banner p { margin: 4px 0 0; }
      .ss-step__actions { margin-top: 16px; display: flex; justify-content: space-between; }
    `,
  ],
})
export class ReviewStepComponent {
  protected readonly store = injectCheckoutStore();
  private readonly checkoutService = inject(CheckoutService);
  private readonly router = inject(Router);

  edit(path: string): void {
    this.router.navigate([path]);
  }

  place(): void {
    const cart = this.store.cart();
    const address = this.store.shippingAddress();
    const method = this.store.shippingMethod();
    const token = this.store.paymentToken();
    if (!cart || !address || !method || !token) return;

    this.store.setSubmitting(true);
    this.store.setError(null);
    this.checkoutService
      .placeLoggedInOrder({ cart, shippingAddress: address, shippingMethod: method, paymentToken: token })
      .subscribe({
        next: (res) => {
          this.store.reset();
          this.router.navigate(['/orders', res.orderId]);
        },
        error: (err) => {
          this.store.setSubmitting(false);
          this.store.setError((err as { error?: { message?: string } }).error?.message ?? 'Unknown error');
        },
      });
  }
}
