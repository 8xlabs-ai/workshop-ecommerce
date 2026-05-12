export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'card';

export interface SavedCard {
  id: string;
  brand: CardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
  holderName: string;
  token: string;
}
