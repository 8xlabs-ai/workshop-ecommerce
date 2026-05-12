import { z } from 'zod';

const addressSchema = z.object({
  fullName: z.string().min(1).max(120),
  line1: z.string().min(1).max(160),
  line2: z.string().max(160).optional(),
  city: z.string().min(1).max(80),
  region: z.string().min(1).max(80),
  postalCode: z.string().min(2).max(20),
  country: z.string().length(2),
  phone: z.string().max(40).optional(),
});

const cartLineSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20),
  variant: z.string().max(40).optional(),
});

const paymentTokenSchema = z
  .string()
  .min(4)
  .regex(/^tok_/, "Payment token must start with 'tok_'");

/** Logged-in checkout — server fetches cart by user_id. */
export const checkoutBody = z.object({
  cartId: z.string().uuid(),
  shippingAddress: addressSchema,
  shippingMethod: z.enum(['standard', 'express']),
  paymentToken: paymentTokenSchema,
});

/**
 * Guest checkout — caller passes cart contents in the body
 * (no anonymous-cart persistence today).
 */
export const guestCheckoutBody = z.object({
  contact: z.object({
    email: z.string().email().toLowerCase(),
    firstName: z.string().min(1).max(64),
    lastName: z.string().min(1).max(64),
    marketingOptIn: z.boolean().default(false),
  }),
  cart: z.object({
    items: z.array(cartLineSchema).min(1).max(50),
  }),
  shippingAddress: addressSchema,
  shippingMethod: z.enum(['standard', 'express']),
  paymentToken: paymentTokenSchema,
});

export type CheckoutInput = z.infer<typeof checkoutBody>;
export type GuestCheckoutInput = z.infer<typeof guestCheckoutBody>;
