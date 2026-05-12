import type { ShippingMethodId } from '@shopstream/shared-types';

export interface ShippingMethodOption {
  value: ShippingMethodId;
  label: string;
  description: string;
  feeCents: number;
  trailing: string;
}

export const SHIPPING_METHODS: ShippingMethodOption[] = [
  {
    value: 'standard',
    label: 'Standard',
    description: '5–7 business days',
    feeCents: 0,
    trailing: 'Free',
  },
  {
    value: 'express',
    label: 'Express',
    description: '2 business days',
    feeCents: 999,
    trailing: '$9.99',
  },
];

export const feeForMethod = (id: ShippingMethodId | null | undefined): number =>
  SHIPPING_METHODS.find((m) => m.value === id)?.feeCents ?? 0;
