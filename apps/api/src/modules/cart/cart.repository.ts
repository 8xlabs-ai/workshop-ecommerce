import { pool, withTransaction } from '../../db/pool.js';

export interface CartRow {
  id: string;
  user_id: string;
  updated_at: Date;
}

export interface CartItemRow {
  id: string;
  cart_id: string;
  product_id: string;
  title: string;
  variant: string | null;
  thumbnail_url: string;
  unit_price_cents: number;
  currency: string;
  quantity: number;
}

/**
 * **Brownfield note**: this repository looks up carts by `user_id`.
 * There is no anonymous-cart concept here today — your guest checkout
 * either introduces a `cart_token` cookie, or passes cart contents in
 * the request body and does not persist. Decide and document.
 */
export const cartRepository = {
  async getOrCreateByUserId(userId: string): Promise<CartRow> {
    const existing = await pool.query<CartRow>(
      `SELECT id, user_id, updated_at FROM carts WHERE user_id = $1 LIMIT 1`,
      [userId],
    );
    if (existing.rows[0]) return existing.rows[0];
    const created = await pool.query<CartRow>(
      `INSERT INTO carts (user_id) VALUES ($1) RETURNING id, user_id, updated_at`,
      [userId],
    );
    if (!created.rows[0]) throw new Error('insert returned no rows');
    return created.rows[0];
  },

  async listItems(cartId: string): Promise<CartItemRow[]> {
    const res = await pool.query<CartItemRow>(
      `SELECT ci.id, ci.cart_id, ci.product_id, p.title, ci.variant,
              p.thumbnail_url, p.price_cents AS unit_price_cents, p.currency, ci.quantity
         FROM cart_items ci
         JOIN products p ON p.id = ci.product_id
        WHERE ci.cart_id = $1
        ORDER BY ci.created_at ASC`,
      [cartId],
    );
    return res.rows;
  },

  async addOrIncrementItem(
    cartId: string,
    productId: string,
    quantity: number,
    variant: string | null,
  ): Promise<void> {
    await withTransaction(async (client) => {
      await client.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity, variant)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (cart_id, product_id, variant)
         DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity,
                       updated_at = now()`,
        [cartId, productId, quantity, variant],
      );
      await client.query(`UPDATE carts SET updated_at = now() WHERE id = $1`, [cartId]);
    });
  },

  async updateItemQuantity(itemId: string, quantity: number): Promise<void> {
    if (quantity === 0) {
      await pool.query(`DELETE FROM cart_items WHERE id = $1`, [itemId]);
      return;
    }
    await pool.query(`UPDATE cart_items SET quantity = $1, updated_at = now() WHERE id = $2`, [
      quantity,
      itemId,
    ]);
  },
};
