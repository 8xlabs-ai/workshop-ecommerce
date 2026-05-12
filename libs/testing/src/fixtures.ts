import type { Address, Cart, CartItem, Order, User } from '@shopstream/shared-types';

export const aUser = (overrides: Partial<User> = {}): User => ({
  id: '11111111-1111-1111-1111-111111111111',
  email: 'sara@shopstream.test',
  firstName: 'Sara',
  lastName: 'Khan',
  role: 'shopper',
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

export const anAddress = (overrides: Partial<Address> = {}): Address => ({
  fullName: 'Sara Khan',
  line1: '123 Market St',
  city: 'San Francisco',
  region: 'CA',
  postalCode: '94103',
  country: 'US',
  ...overrides,
});

export const aCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 'item-1',
  productId: '22222222-2222-2222-2222-222222222222',
  title: 'Linen Throw',
  thumbnailUrl: 'https://picsum.photos/seed/Linen-Throw/600/600',
  unitPrice: { amountCents: 4900, currency: 'USD' },
  quantity: 1,
  ...overrides,
});

export const aCart = (overrides: Partial<Cart> = {}): Cart => {
  const items = overrides.items ?? [aCartItem()];
  const subtotal = items.reduce((a, it) => a + it.unitPrice.amountCents * it.quantity, 0);
  return {
    id: 'cart-1',
    userId: aUser().id,
    items,
    subtotal: { amountCents: subtotal, currency: 'USD' },
    estimatedShipping: { amountCents: subtotal >= 5000 ? 0 : 599, currency: 'USD' },
    estimatedTax: { amountCents: Math.round(subtotal * 0.07), currency: 'USD' },
    total: { amountCents: subtotal, currency: 'USD' }, // simplified for fixtures
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
};

export const anOrder = (overrides: Partial<Order> = {}): Order => {
  const cart = aCart();
  return {
    id: '33333333-3333-3333-3333-333333333333',
    userId: aUser().id,
    cartSnapshot: {
      items: cart.items,
      subtotal: cart.subtotal,
      shipping: cart.estimatedShipping,
      tax: cart.estimatedTax,
      total: cart.total,
    },
    amount: cart.total,
    paymentRef: 'pay_test_1',
    shippingAddress: anAddress(),
    status: 'placed',
    placedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
};
