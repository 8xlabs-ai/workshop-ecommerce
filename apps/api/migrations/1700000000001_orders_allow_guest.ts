import type { MigrationBuilder } from 'node-pg-migrate';

/**
 * Guest-checkout schema change.
 * Decision recorded in the architecture note: nullable user_id + guest_email
 * (over a sibling guest_orders table), so support lookups stay single-query.
 *
 * Rollback: drop guest_email column + restore user_id NOT NULL. Down migration
 * is here for completeness; CI is up-only — exercise locally before relying on it.
 */
export const up = (pgm: MigrationBuilder): void => {
  pgm.alterColumn('orders', 'user_id', { notNull: false });
  pgm.addColumns('orders', {
    guest_email: { type: 'text', notNull: false },
  });
  pgm.addConstraint('orders', 'orders_owner_check', {
    check: '(user_id IS NOT NULL) OR (guest_email IS NOT NULL)',
  });
  pgm.createIndex('orders', 'guest_email', { where: 'guest_email IS NOT NULL' });
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropIndex('orders', 'guest_email');
  pgm.dropConstraint('orders', 'orders_owner_check');
  pgm.dropColumns('orders', ['guest_email']);
  pgm.alterColumn('orders', 'user_id', { notNull: true });
};
