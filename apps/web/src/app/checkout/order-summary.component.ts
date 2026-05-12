import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';
import { formatMoney, type Cart, type Money } from '@shopstream/shared-types';
import { CartStore } from '../cart/cart.store.js';
import { injectCheckoutStore } from './checkout.store.js';
import { feeForMethod } from './shipping-methods.js';

@Component({
  selector: 'ss-order-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="ss-summary">
      <h2 class="ss-summary__title">Order summary</h2>

      <ul class="ss-summary__lines">
        @for (item of cart()?.items ?? []; track item.id) {
          <li class="ss-summary__line">
            <div class="ss-summary__thumb">
              <img [src]="item.thumbnailUrl" [alt]="item.title" />
              <span class="ss-summary__qty">{{ item.quantity }}</span>
            </div>
            <div class="ss-summary__body">
              <p class="ss-summary__line-title">{{ item.title }}</p>
              @if (item.variant) {
                <p class="ss-summary__line-variant">{{ item.variant }}</p>
              }
            </div>
            <span class="ss-summary__price">{{ formatLine(item.unitPrice, item.quantity) }}</span>
          </li>
        }
      </ul>

      <hr class="ss-summary__rule" />

      <dl class="ss-summary__totals">
        <dt>Subtotal</dt><dd>{{ formatM(cart()?.subtotal) }}</dd>
        <dt>Shipping</dt><dd>{{ formatM(shippingFee()) }}</dd>
        <dt>Tax</dt><dd>{{ formatM(cart()?.estimatedTax) }}</dd>
        @if (discountAmount(); as d) {
          <dt class="ss-summary__totals--discount-label">Jeddah discount (10%)</dt>
          <dd class="ss-summary__totals--discount">−{{ formatM(d) }}</dd>
        }
      </dl>

      <hr class="ss-summary__rule" />

      <div class="ss-summary__grand">
        <span class="ss-summary__grand-label">Total</span>
        <span class="ss-summary__grand-value">{{ formatM(grandTotal()) }}</span>
      </div>
    </aside>
  `,
  styles: [
    `
      :host { display: block; }
      .ss-summary {
        background: var(--color-canvas);
        border: 1px solid var(--color-hairline);
        border-radius: var(--rounded-md);
        padding: 24px;
        box-shadow: var(--shadow-card);
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .ss-summary__title { margin: 0; font-size: 20px; font-weight: 600; line-height: 1.30; color: var(--color-ink); }
      .ss-summary__lines { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
      .ss-summary__line { display: flex; align-items: flex-start; gap: 12px; }
      .ss-summary__thumb {
        position: relative;
        width: 48px; height: 48px;
        border-radius: var(--rounded-sm);
        overflow: hidden;
        background: var(--color-surface-soft);
        flex-shrink: 0;
      }
      .ss-summary__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .ss-summary__qty {
        position: absolute;
        top: -6px; right: -6px;
        width: 20px; height: 20px;
        border-radius: 9999px;
        background: var(--color-ink);
        color: var(--color-on-primary);
        font-size: 12px;
        font-weight: 600;
        display: flex; align-items: center; justify-content: center;
      }
      .ss-summary__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
      .ss-summary__line-title { margin: 0; font-size: 16px; line-height: 1.5; color: var(--color-ink); display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
      .ss-summary__line-variant { margin: 0; font-size: 14px; color: var(--color-muted); }
      .ss-summary__price { font-size: 16px; font-weight: 600; line-height: 1.30; color: var(--color-ink); font-variant-numeric: tabular-nums; }

      .ss-summary__rule { border: none; border-top: 1px solid var(--color-hairline); margin: 0; }

      .ss-summary__totals {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 6px 16px;
        margin: 0;
      }
      .ss-summary__totals dt { font-size: 16px; color: var(--color-body); }
      .ss-summary__totals dd { margin: 0; font-size: 16px; color: var(--color-ink); font-variant-numeric: tabular-nums; text-align: right; }
      .ss-summary__totals--discount-label { color: var(--color-success, #1a7a4c) !important; }
      .ss-summary__totals--discount { color: var(--color-success, #1a7a4c) !important; }

      .ss-summary__grand { display: flex; align-items: baseline; justify-content: space-between; }
      .ss-summary__grand-label { font-size: 16px; font-weight: 600; color: var(--color-ink); }
      .ss-summary__grand-value { font-size: 22px; font-weight: 700; line-height: 1.20; color: var(--color-ink); font-variant-numeric: tabular-nums; }
    `,
  ],
})
export class OrderSummaryComponent {
  private readonly cartStore = inject(CartStore);
  private readonly checkoutStore = injectCheckoutStore();

  protected readonly cart = signal<Cart | null>(null);

  @Input() set cartInput(value: Cart | null) {
    this.cart.set(value);
  }
  @Input('cart') set _cart(value: Cart | null) {
    this.cart.set(value);
  }

  protected readonly discountAmount = computed<Money | null>(() => this.cartStore.discountAmount());

  protected readonly shippingFee = computed<Money | null>(() => {
    const c = this.cart();
    if (!c) return null;
    const cents = feeForMethod(this.checkoutStore.shippingMethod());
    return { amountCents: cents, currency: c.subtotal.currency };
  });

  protected readonly grandTotal = computed<Money | null>(() => {
    const c = this.cart();
    if (!c) return null;
    const ship = feeForMethod(this.checkoutStore.shippingMethod());
    const discount = this.cartStore.discountAmount()?.amountCents ?? 0;
    const cents =
      c.subtotal.amountCents + ship + c.estimatedTax.amountCents - discount;
    return { amountCents: Math.max(0, cents), currency: c.subtotal.currency };
  });

  protected formatM(m: Money | null | undefined): string {
    return m ? formatMoney(m) : '—';
  }
  protected formatLine(unit: Money, qty: number): string {
    return formatMoney({ amountCents: unit.amountCents * qty, currency: unit.currency });
  }
}
