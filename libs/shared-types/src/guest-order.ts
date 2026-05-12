import type { Order } from './order.js';

/**
 * GuestOrder is the same shape as Order but with userId === null and
 * a required guestEmail field used for post-purchase lookups.
 */
export interface GuestOrder extends Omit<Order, 'userId'> {
  userId: null;
  guestEmail: string;
}

export const isGuestOrder = (order: Order | GuestOrder): order is GuestOrder =>
  order.userId === null && 'guestEmail' in order;
