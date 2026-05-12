import type { Order, OrderSnapshot } from '@shopstream/shared-types';
import { ConflictError, FeatureDisabledError, PaymentDeclinedError } from '../../lib/errors.js';
import { featureFlags } from '../../lib/feature-flags.js';
import { catalogRepository } from '../catalog/catalog.repository.js';
import { ordersRepository } from '../orders/orders.repository.js';
import { payxClient } from '../payments/payx-client.js';
import { cartService } from '../cart/cart.service.js';
import type { CheckoutInput, GuestCheckoutInput } from './checkout.schemas.js';

const SHIPPING_RATES = {
  standard: 0,
  express: 999,
} as const;
const TAX_RATE = 0.07;

interface PricedSnapshot {
  snapshot: OrderSnapshot;
  totalCents: number;
}

const price = async (
  items: { productId: string; quantity: number; variant?: string }[],
  method: 'standard' | 'express',
): Promise<PricedSnapshot> => {
  const lines = await Promise.all(
    items.map(async (line) => {
      const product = await catalogRepository.findById(line.productId);
      if (!product) throw new ConflictError(`Product ${line.productId} no longer available`);
      if (product.in_stock < line.quantity) {
        throw new ConflictError(`Only ${product.in_stock} left of ${product.title}`);
      }
      return {
        id: line.productId,
        productId: line.productId,
        title: product.title,
        variant: line.variant,
        thumbnailUrl: product.thumbnail_url,
        unitPrice: { amountCents: product.price_cents, currency: 'USD' as const },
        quantity: line.quantity,
      };
    }),
  );

  const subtotalCents = lines.reduce((a, l) => a + l.unitPrice.amountCents * l.quantity, 0);
  const shippingCents = subtotalCents >= 5000 ? 0 : SHIPPING_RATES[method];
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + shippingCents + taxCents;

  return {
    snapshot: {
      items: lines,
      subtotal: { amountCents: subtotalCents, currency: 'USD' },
      shipping: { amountCents: shippingCents, currency: 'USD' },
      tax: { amountCents: taxCents, currency: 'USD' },
      total: { amountCents: totalCents, currency: 'USD' },
    },
    totalCents,
  };
};

export const checkoutService = {
  /** Logged-in checkout — preserves existing behaviour. */
  async placeOrder(userId: string, input: CheckoutInput): Promise<Order> {
    const cart = await cartService.loadForUser(userId);
    if (cart.id !== input.cartId) throw new ConflictError('Cart mismatch — refresh and retry');
    if (cart.items.length === 0) throw new ConflictError('Cart is empty');

    const priced = await price(cart.items, input.shippingMethod);

    const capture = await payxClient.capture(
      input.paymentToken as `tok_${string}`,
      priced.totalCents,
    );
    if (capture.status !== 'captured') {
      throw new PaymentDeclinedError(capture.declineReason ?? 'unknown');
    }

    return ordersRepository.insert({
      userId,
      guestEmail: null,
      cartSnapshot: priced.snapshot,
      amountCents: priced.totalCents,
      currency: 'USD',
      paymentRef: capture.paymentRef,
      shippingAddress: input.shippingAddress,
    });
  },

  /**
   * Guest checkout — feature-flagged.
   * The body carries cart contents directly; no anonymous-cart row is persisted.
   */
  async placeGuestOrder(input: GuestCheckoutInput, ctx: { ip?: string }): Promise<Order> {
    if (!featureFlags.isEnabled('guest_checkout_enabled', { ip: ctx.ip })) {
      throw new FeatureDisabledError('guest_checkout_enabled');
    }

    const priced = await price(input.cart.items, input.shippingMethod);

    const capture = await payxClient.capture(
      input.paymentToken as `tok_${string}`,
      priced.totalCents,
    );
    if (capture.status !== 'captured') {
      throw new PaymentDeclinedError(capture.declineReason ?? 'unknown');
    }

    return ordersRepository.insert({
      userId: null,
      guestEmail: input.contact.email,
      cartSnapshot: priced.snapshot,
      amountCents: priced.totalCents,
      currency: 'USD',
      paymentRef: capture.paymentRef,
      shippingAddress: input.shippingAddress,
    });
  },
};
