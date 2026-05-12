export interface Address {
  id?: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export type ShippingMethodId = 'standard' | 'express';

export interface ShippingMethod {
  id: ShippingMethodId;
  label: string;
  etaDescription: string;
  priceCents: number;
}
