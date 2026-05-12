import { pool } from '../../db/pool.js';
import type { Order, OrderSnapshot } from '@shopstream/shared-types';

interface OrderRow {
  id: string;
  user_id: string | null;
  guest_email: string | null;
  cart_snapshot: OrderSnapshot;
  amount_cents: number;
  currency: string;
  payment_ref: string;
  shipping_addr: Order['shippingAddress'];
  status: Order['status'];
  placed_at: Date;
}

const toOrder = (row: OrderRow): Order => ({
  id: row.id,
  userId: row.user_id,
  cartSnapshot: row.cart_snapshot,
  amount: { amountCents: row.amount_cents, currency: row.currency as 'USD' },
  paymentRef: row.payment_ref,
  shippingAddress: row.shipping_addr,
  status: row.status,
  placedAt: row.placed_at.toISOString(),
});

export const ordersRepository = {
  /** Owner-scoped list. Used by /api/orders for logged-in shoppers. */
  async listByUser(userId: string): Promise<Order[]> {
    const res = await pool.query<OrderRow>(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY placed_at DESC LIMIT 50`,
      [userId],
    );
    return res.rows.map(toOrder);
  },

  /** Owner-scoped lookup. The classic call used by the logged-in flow. */
  async findByIdAndUser(orderId: string, userId: string): Promise<Order | null> {
    const res = await pool.query<OrderRow>(
      `SELECT * FROM orders WHERE id = $1 AND user_id = $2 LIMIT 1`,
      [orderId, userId],
    );
    return res.rows[0] ? toOrder(res.rows[0]) : null;
  },

  /**
   * Guest-friendly lookup. Pair the order id with the email captured at
   * checkout. Use ONLY for the post-purchase confirmation screen.
   */
  async findByIdAndEmail(orderId: string, email: string): Promise<Order | null> {
    const res = await pool.query<OrderRow>(
      `SELECT * FROM orders
        WHERE id = $1
          AND user_id IS NULL
          AND guest_email = $2
        LIMIT 1`,
      [orderId, email],
    );
    return res.rows[0] ? toOrder(res.rows[0]) : null;
  },

  async insert(input: {
    userId: string | null;
    guestEmail: string | null;
    cartSnapshot: OrderSnapshot;
    amountCents: number;
    currency: string;
    paymentRef: string;
    shippingAddress: Order['shippingAddress'];
  }): Promise<Order> {
    const res = await pool.query<OrderRow>(
      `INSERT INTO orders
         (user_id, guest_email, cart_snapshot, amount_cents, currency, payment_ref, shipping_addr)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        input.userId,
        input.guestEmail,
        input.cartSnapshot,
        input.amountCents,
        input.currency,
        input.paymentRef,
        input.shippingAddress,
      ],
    );
    if (!res.rows[0]) throw new Error('insert returned no rows');
    return toOrder(res.rows[0]);
  },
};
