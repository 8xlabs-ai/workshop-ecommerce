/* eslint-disable no-console */
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { loadEnv } from '../src/config/env.js';

const env = loadEnv();
const pool = new Pool({ connectionString: env.DATABASE_URL });

const DEMO_USERS = [
  {
    email: 'sara@shopstream.test',
    password: 'shopper123',
    firstName: 'Sara',
    lastName: 'Khan',
    role: 'shopper',
  },
  {
    email: 'omar@shopstream.test',
    password: 'shopper123',
    firstName: 'Omar',
    lastName: 'Hassan',
    role: 'shopper',
  },
  {
    email: 'admin@shopstream.test',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
];

const CATEGORIES = ['home', 'apparel', 'electronics'] as const;
const ADJECTIVES = ['Linen', 'Walnut', 'Stoneware', 'Merino', 'Cotton', 'Cedar', 'Brass', 'Marble'];
const NOUNS = ['Throw', 'Lamp', 'Mug', 'Tee', 'Sock', 'Bowl', 'Knob', 'Tray'];

const makeProducts = () => {
  const products: Array<{
    title: string;
    description: string;
    category: (typeof CATEGORIES)[number];
    price_cents: number;
    thumbnail_url: string;
    in_stock: number;
  }> = [];
  let seed = 1;
  for (const adj of ADJECTIVES) {
    for (const noun of NOUNS) {
      const category = CATEGORIES[(seed - 1) % CATEGORIES.length]!;
      products.push({
        title: `${adj} ${noun}`,
        description: `Hand-finished ${noun.toLowerCase()} in soft ${adj.toLowerCase()}.`,
        category,
        price_cents: 1900 + ((seed * 137) % 4800),
        thumbnail_url: `https://picsum.photos/seed/${encodeURIComponent(`${adj}-${noun}`)}/600/600`,
        in_stock: 5 + (seed % 30),
      });
      seed += 1;
    }
  }
  return products;
};

const run = async (): Promise<void> => {
  console.log('Seeding ShopStream demo data…');

  for (const u of DEMO_USERS) {
    const hash = await bcrypt.hash(u.password, 10);
    await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      [u.email, hash, u.firstName, u.lastName, u.role],
    );
  }

  for (const p of makeProducts()) {
    await pool.query(
      `INSERT INTO products (title, description, category, price_cents, thumbnail_url, in_stock)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      [p.title, p.description, p.category, p.price_cents, p.thumbnail_url, p.in_stock],
    );
  }

  console.log('Seed complete.');
  await pool.end();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
