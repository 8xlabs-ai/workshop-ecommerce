import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import type { Cart, Money } from '@shopstream/shared-types';
import { CartService } from './cart.service.js';

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  discountPercent: number;
}

const initial: CartState = { cart: null, loading: false, error: null, discountPercent: 0 };

/**
 * Storefront-scoped cart store. Single source of truth for top-nav badge,
 * catalog Add-to-cart, product detail Add-to-cart, and the cart page.
 *
 * **NOT** the same as `CheckoutStore.cart` — at handoff to /checkout the
 * shell copies a snapshot from here into CheckoutStore so the order is
 * frozen for the duration of the flow. Don't try to consolidate them.
 */
export const CartStore = signalStore(
  { providedIn: 'root' },
  withState<CartState>(initial),
  withComputed((state) => ({
    itemCount: computed(() =>
      (state.cart()?.items ?? []).reduce((acc, it) => acc + it.quantity, 0),
    ),
    isEmpty: computed(() => (state.cart()?.items?.length ?? 0) === 0),
    discountAmount: computed<Money | null>(() => {
      const c = state.cart();
      const pct = state.discountPercent();
      if (!c || pct <= 0) return null;
      return {
        amountCents: Math.round(c.subtotal.amountCents * pct),
        currency: c.subtotal.currency,
      };
    }),
    discountedTotal: computed<Money | null>(() => {
      const c = state.cart();
      const pct = state.discountPercent();
      if (!c) return null;
      if (pct <= 0) return c.total;
      const off = Math.round(c.subtotal.amountCents * pct);
      return {
        amountCents: Math.max(0, c.total.amountCents - off),
        currency: c.total.currency,
      };
    }),
  })),
  withMethods((store) => {
    const cartService = inject(CartService);
    const setLoading = (loading: boolean) => patchState(store, { loading });
    const setError = (error: string | null) => patchState(store, { error });
    const setCart = (cart: Cart | null) => patchState(store, { cart, loading: false, error: null });

    return {
      load(): void {
        setLoading(true);
        cartService.load().subscribe({
          next: (cart) => setCart(cart),
          error: () => {
            setLoading(false);
            setError('Could not load cart');
          },
        });
      },
      addItem(productId: string, quantity = 1): void {
        setLoading(true);
        cartService.addItem(productId, quantity).subscribe({
          next: (cart) => setCart(cart),
          error: () => {
            setLoading(false);
            setError('Could not add to cart');
          },
        });
      },
      setQuantity(itemId: string, quantity: number): void {
        const current = store.cart();
        if (!current) return;
        // Optimistic mirror so the stepper feels instant; BE roundtrips
        // overwrite with the authoritative cart shortly after.
        const optimistic =
          quantity === 0
            ? { ...current, items: current.items.filter((it) => it.id !== itemId) }
            : {
                ...current,
                items: current.items.map((it) =>
                  it.id === itemId ? { ...it, quantity } : it,
                ),
              };
        patchState(store, { cart: optimistic, loading: true });
        cartService.updateQuantity(itemId, quantity).subscribe({
          next: (cart) => setCart(cart),
          error: () => {
            // Revert by reloading from BE.
            cartService.load().subscribe({
              next: (cart) => setCart(cart),
              error: () => {
                setLoading(false);
                setError('Could not update cart');
              },
            });
          },
        });
      },
      setDiscountPercent(pct: number): void {
        patchState(store, { discountPercent: Math.max(0, Math.min(1, pct)) });
      },
      clear(): void {
        patchState(store, initial);
      },
    };
  }),
);

export const injectCartStore = () => inject(CartStore);
