import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { BreadcrumbComponent, type BreadcrumbStep } from '../core/layout/breadcrumb.component.js';
import { AuthService } from '../core/auth/auth.service.js';
import { CheckoutService } from './checkout.service.js';
import { injectCheckoutStore } from './checkout.store.js';
import { OrderSummaryComponent } from './order-summary.component.js';

/**
 * Two-column wrapper used by both the logged-in flow and the guest flow.
 * Step labels come from the child route's data; the active step is whichever
 * route is currently primary.
 */
@Component({
  selector: 'ss-checkout-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, BreadcrumbComponent, OrderSummaryComponent],
  template: `
    <section class="ss-checkout">
      <div class="ss-checkout__inner">
        <ss-breadcrumb [steps]="breadcrumb()" />
        <h1 class="ss-checkout__title">Checkout</h1>
        <div class="ss-checkout__grid">
          <div class="ss-checkout__form">
            <router-outlet />
          </div>
          <ss-order-summary [cart]="cart()" />
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .ss-checkout { padding: 32px 24px 56px; }
      .ss-checkout__inner {
        max-width: 1040px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .ss-checkout__title { margin: 0; font-size: 32px; font-weight: 700; line-height: 1.20; color: var(--color-ink); }
      .ss-checkout__grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 360px;
        gap: 32px;
        align-items: start;
      }
      .ss-checkout__form { display: flex; flex-direction: column; gap: 24px; }

      @media (max-width: 1024px) {
        .ss-checkout__grid { grid-template-columns: 1fr; }
      }
    `,
  ],
})
export class CheckoutShellComponent implements OnInit {
  private readonly checkoutService = inject(CheckoutService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly store = injectCheckoutStore();

  protected readonly cart = this.store.cart;

  protected readonly breadcrumb = computed<BreadcrumbStep[]>(() => [
    { label: 'Cart' },
    { label: 'Address' },
    { label: 'Shipping' },
    { label: 'Payment' },
    { label: 'Review' },
  ]);

  ngOnInit(): void {
    // Don't fetch the auth-only cart for guests — they don't have one.
    const isGuestPath = this.router.url.startsWith('/checkout/guest');
    if (isGuestPath || !this.auth.isAuthenticated()) {
      return;
    }
    if (!this.store.cart()) {
      this.checkoutService.loadCart().subscribe((cart) => this.store.setCart(cart));
    }
  }
}
