import type { Address } from './address.js';
import type { CartItem } from './cart.js';
import type { Money } from './money.js';

export type OrderStatus = 'placed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderSnapshot {
  items: CartItem[];
  subtotal: Money;
  shipping: Money;
  tax: Money;
  total: Money;
}

export interface Order {
  id: string;
  userId: string | null;
  cartSnapshot: OrderSnapshot;
  amount: Money;
  paymentRef: string;
  shippingAddress: Address;
  status: OrderStatus;
  placedAt: string;
}
