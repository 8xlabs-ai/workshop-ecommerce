import type { CardBrand } from './card.types.js';

export const detectBrand = (numberDigits: string): CardBrand => {
  const n = numberDigits.replace(/\D/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^(6011|65|64[4-9])/.test(n)) return 'discover';
  return 'card';
};

export const brandLabel = (b: CardBrand): string => {
  switch (b) {
    case 'visa': return 'Visa';
    case 'mastercard': return 'Mastercard';
    case 'amex': return 'Amex';
    case 'discover': return 'Discover';
    default: return 'Card';
  }
};

export const formatCardNumberInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

export const formatExpiryInput = (raw: string): string => {
  const d = raw.replace(/\D/g, '').slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
};

export const parseExpiry = (
  value: string,
): { month: number; year: number } | null => {
  const m = value.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return null;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return null;
  return { month, year };
};

export const last4Of = (numberDigits: string): string =>
  numberDigits.replace(/\D/g, '').slice(-4);

export const generateLocalToken = (): string =>
  `tok_test_local_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
