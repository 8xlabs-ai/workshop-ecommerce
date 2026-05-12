import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { formatMoney } from '@shopstream/shared-types';
import { AuthService } from '../core/auth/auth.service.js';
import { FfEnabledDirective } from '../core/feature-flags/ff-enabled.directive.js';
import { CartStore } from './cart.store.js';

@Component({
  selector: 'ss-cart-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatIconModule, FfEnabledDirective],
  template: `
    <section class="ss-cart">
      <h1>Cart</h1>

      @if (auth.isAuthenticated()) {
        @if (cart(); as c) {
          @if (c.items.length === 0) {
            <p>Your cart is empty. <a routerLink="/">Continue shopping</a>.</p>
          } @else {
            <ul class="ss-cart__lines">
              @for (it of c.items; track it.id) {
                <li class="ss-cart__line">
                  <img [src]="it.thumbnailUrl" [alt]="it.title" />
                  <div class="ss-cart__line-body">
                    <p class="ss-cart__line-title">{{ it.title }}</p>
                    @if (it.variant) {
                      <p class="ss-cart__line-variant">{{ it.variant }}</p>
                    }
                  </div>
                  <div class="ss-stepper">
                    <button mat-icon-button type="button" aria-label="Decrease" (click)="onQty(it.id, it.quantity - 1)">
                      <mat-icon>remove</mat-icon>
                    </button>
                    <span class="ss-stepper__value">{{ it.quantity }}</span>
                    <button mat-icon-button type="button" aria-label="Increase" (click)="onQty(it.id, it.quantity + 1)">
                      <mat-icon>add</mat-icon>
                    </button>
                  </div>
                  <span class="ss-cart__line-price">{{ formatLineTotal(it.unitPrice.amountCents, it.quantity) }}</span>
                  <button mat-icon-button type="button" [attr.aria-label]="'Remove ' + it.title" (click)="remove(it.id)">
                    <mat-icon>close</mat-icon>
                  </button>
                </li>
              }
            </ul>

            <footer class="ss-cart__footer">
              <dl class="ss-cart__totals">
                <dt>Subtotal</dt><dd>{{ formatMoney(c.subtotal) }}</dd>
                <dt>Shipping</dt><dd>{{ formatMoney(c.estimatedShipping) }}</dd>
                <dt>Tax</dt><dd>{{ formatMoney(c.estimatedTax) }}</dd>
                @if (discountAmount(); as d) {
                  <dt>Jeddah discount (10%)</dt>
                  <dd class="ss-cart__totals--discount">−{{ formatMoney(d) }}</dd>
                }
                <dt><strong>Total</strong></dt>
                <dd><strong>{{ formatMoney(discountedTotal() ?? c.total) }}</strong></dd>
              </dl>

              <div class="ss-cart__actions">
                <button mat-flat-button color="primary" type="button" (click)="checkout()">Checkout</button>
              </div>
            </footer>
          }
        } @else {
          <p>Loading…</p>
        }
      } @else {
        <p>Your cart is empty. <a routerLink="/">Continue shopping</a>.</p>
        <p>
          <a routerLink="/account/login">Sign in</a>
          <a *ffEnabled="'guest_checkout_enabled'" routerLink="/checkout/guest/contact" style="margin-left: 16px;">Continue as guest</a>
        </p>
      }
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .ss-cart { max-width: 1040px; margin: 0 auto; padding: 32px 24px 48px; display: flex; flex-direction: column; gap: 24px; }
      .ss-cart__lines { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; }
      .ss-cart__line {
        display: grid;
        grid-template-columns: 64px 1fr auto auto 40px;
        gap: 16px;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid rgba(0,0,0,0.08);
      }
      .ss-cart__line img { width: 64px; height: 64px; object-fit: cover; border-radius: 4px; }
      .ss-cart__line-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
      .ss-cart__line-title { margin: 0; font-size: 16px; }
      .ss-cart__line-variant { margin: 0; font-size: 14px; color: rgba(0,0,0,0.6); }
      .ss-cart__line-price { font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums; min-width: 80px; text-align: right; }
      .ss-stepper { display: inline-flex; align-items: center; gap: 4px; }
      .ss-stepper__value { min-width: 24px; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums; }

      .ss-cart__footer { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; }
      .ss-cart__totals { display: grid; grid-template-columns: 1fr auto; gap: 6px 24px; margin: 0; min-width: 240px; }
      .ss-cart__totals dt { color: rgba(0,0,0,0.7); }
      .ss-cart__totals dd { margin: 0; text-align: right; font-variant-numeric: tabular-nums; }
      .ss-cart__totals--discount { color: #1a7a4c; }
      .ss-cart__actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
    `,
  ],
})
export class CartPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly cartStore = inject(CartStore);
  protected readonly auth = inject(AuthService);

  protected readonly cart = computed(() => this.cartStore.cart());
  protected readonly discountAmount = computed(() => this.cartStore.discountAmount());
  protected readonly discountedTotal = computed(() => this.cartStore.discountedTotal());
  protected readonly formatMoney = formatMoney;

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.cartStore.load();
    }
  }

  formatLineTotal(cents: number, qty: number): string {
    return `$${((cents * qty) / 100).toFixed(2)}`;
  }

  onQty(itemId: string, qty: number): void {
    this.cartStore.setQuantity(itemId, Math.max(0, qty));
  }

  remove(itemId: string): void {
    this.cartStore.setQuantity(itemId, 0);
  }

  checkout(): void {
    this.router.navigate(['/checkout/address']);
  }
}
