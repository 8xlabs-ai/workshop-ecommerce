import { describe, expect, it } from 'vitest';
import { guestCheckoutBody } from '../checkout.schemas.js';

describe('guestCheckoutBody', () => {
  const validBody = {
    contact: {
      email: 'amelia@example.com',
      firstName: 'Amelia',
      lastName: 'Reyes',
      marketingOptIn: false,
    },
    cart: {
      items: [{ productId: 'a1b2c3d4-e5f6-4789-aaaa-bbbbccccdddd', quantity: 2 }],
    },
    shippingAddress: {
      fullName: 'Amelia Reyes',
      line1: '123 Market St',
      city: 'San Francisco',
      region: 'CA',
      postalCode: '94103',
      country: 'US',
    },
    shippingMethod: 'standard' as const,
    paymentToken: 'tok_test_4242',
  };

  it('accepts a well-formed guest checkout body', () => {
    const result = guestCheckoutBody.safeParse(validBody);
    expect(result.success).toBe(true);
  });

  it('rejects a payment token that is not tok_-prefixed', () => {
    const result = guestCheckoutBody.safeParse({
      ...validBody,
      paymentToken: 'card_4242424242424242',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty cart', () => {
    const result = guestCheckoutBody.safeParse({
      ...validBody,
      cart: { items: [] },
    });
    expect(result.success).toBe(false);
  });

  it('lowercases the contact email', () => {
    const result = guestCheckoutBody.parse({
      ...validBody,
      contact: { ...validBody.contact, email: 'AMELIA@example.COM' },
    });
    expect(result.contact.email).toBe('amelia@example.com');
  });
});
