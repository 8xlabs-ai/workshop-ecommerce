import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import type { Address, Cart, ShippingMethodId } from '@shopstream/shared-types';

export interface GuestContact {
  email: string;
  firstName: string;
  lastName: string;
  marketingOptIn: boolean;
}

export interface CheckoutState {
  cart: Cart | null;
  guestContact: GuestContact | null;
  shippingAddress: Address | null;
  shippingMethod: ShippingMethodId | null;
  paymentToken: string | null;
  submitting: boolean;
  error: string | null;
}

const initial: CheckoutState = {
  cart: null,
  guestContact: null,
  shippingAddress: null,
  shippingMethod: null,
  paymentToken: null,
  submitting: false,
  error: null,
};

/**
 * Single source of truth for the checkout flow (both logged-in and guest).
 * Routes carry step state in query params; this store carries everything
 * the API call needs to actually place the order.
 */
export const CheckoutStore = signalStore(
  { providedIn: 'root' },
  withState<CheckoutState>(initial),
  withComputed((state) => ({
    canSubmitLoggedIn: computed(
      () =>
        !!state.cart() &&
        !!state.shippingAddress() &&
        !!state.shippingMethod() &&
        !!state.paymentToken(),
    ),
    canSubmitGuest: computed(
      () =>
        !!state.guestContact() &&
        !!state.cart() &&
        !!state.shippingAddress() &&
        !!state.shippingMethod() &&
        !!state.paymentToken(),
    ),
  })),
  withMethods((store) => ({
    setCart(cart: Cart | null): void {
      patchState(store, { cart });
    },
    setGuestContact(contact: GuestContact): void {
      patchState(store, { guestContact: contact });
    },
    setShippingAddress(address: Address): void {
      patchState(store, { shippingAddress: address });
    },
    setShippingMethod(method: ShippingMethodId): void {
      patchState(store, { shippingMethod: method });
    },
    setPaymentToken(token: string): void {
      patchState(store, { paymentToken: token });
    },
    setSubmitting(submitting: boolean): void {
      patchState(store, { submitting });
    },
    setError(error: string | null): void {
      patchState(store, { error });
    },
    reset(): void {
      patchState(store, initial);
    },
  })),
);

/** Injection helper for components. */
export const injectCheckoutStore = () => inject(CheckoutStore);
