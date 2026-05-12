import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FfEnabledDirective } from '../../core/feature-flags/ff-enabled.directive.js';
import { injectCheckoutStore } from '../checkout.store.js';

@Component({
  selector: 'ss-guest-contact-step',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FfEnabledDirective,
  ],
  template: `
    <ng-container *ffEnabled="'guest_checkout_enabled'">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="ss-step">
        <h2 class="ss-step__title">Contact</h2>
        <p class="ss-step__hint">
          We'll send your order confirmation here.
          <a routerLink="/account/login">Have an account? Sign in.</a>
        </p>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" />
          <mat-hint>We don't share your email. Order updates only.</mat-hint>
        </mat-form-field>

        <div class="ss-step__row">
          <mat-form-field appearance="outline">
            <mat-label>First name</mat-label>
            <input matInput formControlName="firstName" autocomplete="given-name" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Last name</mat-label>
            <input matInput formControlName="lastName" autocomplete="family-name" />
          </mat-form-field>
        </div>

        <mat-checkbox formControlName="marketingOptIn">
          Email me with news and offers — unsubscribe any time.
        </mat-checkbox>

        <div class="ss-step__actions">
          <a routerLink="/cart">← Back to cart</a>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Continue to shipping</button>
        </div>
      </form>
    </ng-container>
  `,
  styles: [
    `
      .ss-step { display: flex; flex-direction: column; gap: 8px; }
      .ss-step__title { margin: 0 0 8px; font-size: 24px; font-weight: 600; }
      .ss-step__hint { margin: 0 0 8px; font-size: 16px; color: rgba(0,0,0,0.7); }
      .ss-step__row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .ss-step__actions { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; }
      mat-form-field { width: 100%; }
      @media (max-width: 640px) { .ss-step__row { grid-template-columns: 1fr; } }
    `,
  ],
})
export class GuestContactStepComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = injectCheckoutStore();
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', [Validators.required, Validators.minLength(1)]],
    lastName: ['', [Validators.required, Validators.minLength(1)]],
    marketingOptIn: [false],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.store.setGuestContact(this.form.getRawValue());
    this.router.navigate(['/checkout/guest/shipping-payment']);
  }
}
