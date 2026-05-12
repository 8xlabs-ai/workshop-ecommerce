import { pool } from '../../db/pool.js';

export interface ProductRow {
  id: string;
  title: string;
  description: string;
  category: 'home' | 'apparel' | 'electronics';
  price_cents: number;
  currency: string;
  thumbnail_url: string;
  in_stock: number;
}

export const catalogRepository = {
  async list(opts: {
    page: number;
    pageSize: number;
    category?: 'home' | 'apparel' | 'electronics';
  }): Promise<{ items: ProductRow[]; total: number }> {
    const offset = (opts.page - 1) * opts.pageSize;
    const params: unknown[] = [];
    let where = '';
    if (opts.category) {
      params.push(opts.category);
      where = `WHERE category = $${params.length}`;
    }
    const countRes = await pool.query<{ count: string }>(
      `SELECT count(*) FROM products ${where}`,
      params,
    );
    params.push(opts.pageSize, offset);
    const itemsRes = await pool.query<ProductRow>(
      `SELECT id, title, description, category, price_cents, currency, thumbnail_url, in_stock
         FROM products
        ${where}
        ORDER BY title ASC
        LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );
    return { items: itemsRes.rows, total: Number(countRes.rows[0]?.count ?? 0) };
  },

  async findById(id: string): Promise<ProductRow | null> {
    const res = await pool.query<ProductRow>(
      `SELECT id, title, description, category, price_cents, currency, thumbnail_url, in_stock
         FROM products
        WHERE id = $1`,
      [id],
    );
    return res.rows[0] ?? null;
  },
};
