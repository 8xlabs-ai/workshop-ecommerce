import type { Cart, CartItem } from '@shopstream/shared-types';
import { cartRepository, type CartItemRow } from './cart.repository.js';

const toItem = (row: CartItemRow): CartItem => ({
  id: row.id,
  productId: row.product_id,
  title: row.title,
  variant: row.variant ?? undefined,
  thumbnailUrl: row.thumbnail_url,
  unitPrice: { amountCents: row.unit_price_cents, currency: row.currency as 'USD' },
  quantity: row.quantity,
});

const sumCents = (items: CartItem[]): number =>
  items.reduce((acc, it) => acc + it.unitPrice.amountCents * it.quantity, 0);

export const cartService = {
  async loadForUser(userId: string): Promise<Cart> {
    const cart = await cartRepository.getOrCreateByUserId(userId);
    const itemRows = await cartRepository.listItems(cart.id);
    const items = itemRows.map(toItem);
    const subtotal = { amountCents: sumCents(items), currency: 'USD' as const };
    const estimatedShipping = {
      amountCents: subtotal.amountCents >= 5000 ? 0 : 599,
      currency: 'USD' as const,
    };
    const estimatedTax = {
      amountCents: Math.round(subtotal.amountCents * 0.07),
      currency: 'USD' as const,
    };
    const total = {
      amountCents: subtotal.amountCents + estimatedShipping.amountCents + estimatedTax.amountCents,
      currency: 'USD' as const,
    };
    return {
      id: cart.id,
      userId: cart.user_id,
      items,
      subtotal,
      estimatedShipping,
      estimatedTax,
      total,
      updatedAt: cart.updated_at.toISOString(),
    };
  },
};
