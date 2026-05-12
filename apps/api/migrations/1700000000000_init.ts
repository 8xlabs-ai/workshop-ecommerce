import type { MigrationBuilder } from 'node-pg-migrate';

export const shorthands: undefined = undefined;

export const up = (pgm: MigrationBuilder): void => {
  pgm.createExtension('pgcrypto', { ifNotExists: true });

  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    email: { type: 'text', notNull: true, unique: true },
    password_hash: { type: 'text', notNull: true },
    first_name: { type: 'text', notNull: true },
    last_name: { type: 'text', notNull: true },
    role: { type: 'text', notNull: true, default: 'shopper' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });
  pgm.addConstraint('users', 'users_role_check', { check: "role IN ('shopper', 'admin')" });

  pgm.createTable('products', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    title: { type: 'text', notNull: true },
    description: { type: 'text', notNull: true, default: '' },
    category: { type: 'text', notNull: true },
    price_cents: { type: 'integer', notNull: true },
    currency: { type: 'char(3)', notNull: true, default: 'USD' },
    thumbnail_url: { type: 'text', notNull: true },
    in_stock: { type: 'integer', notNull: true, default: 0 },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });
  pgm.addConstraint('products', 'products_category_check', {
    check: "category IN ('home', 'apparel', 'electronics')",
  });
  pgm.createIndex('products', 'category');

  pgm.createTable('carts', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: {
      type: 'uuid',
      notNull: true,
      unique: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('cart_items', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    cart_id: { type: 'uuid', notNull: true, references: 'carts(id)', onDelete: 'CASCADE' },
    product_id: { type: 'uuid', notNull: true, references: 'products(id)' },
    quantity: { type: 'integer', notNull: true, default: 1 },
    variant: { type: 'text', notNull: false },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });
  pgm.addConstraint('cart_items', 'cart_items_cart_product_variant_uq', {
    unique: ['cart_id', 'product_id', 'variant'],
  });
  pgm.createIndex('cart_items', 'cart_id');

  pgm.createTable('orders', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', notNull: true, references: 'users(id)' },
    cart_snapshot: { type: 'jsonb', notNull: true },
    amount_cents: { type: 'integer', notNull: true },
    currency: { type: 'char(3)', notNull: true, default: 'USD' },
    payment_ref: { type: 'text', notNull: true },
    shipping_addr: { type: 'jsonb', notNull: true },
    status: { type: 'text', notNull: true, default: 'placed' },
    placed_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });
  pgm.createIndex('orders', 'user_id');
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropTable('orders');
  pgm.dropTable('cart_items');
  pgm.dropTable('carts');
  pgm.dropTable('products');
  pgm.dropTable('users');
};
