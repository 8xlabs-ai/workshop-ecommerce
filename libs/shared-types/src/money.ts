export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

export interface Money {
  amountCents: number;
  currency: CurrencyCode;
}

export const zeroMoney = (currency: CurrencyCode = 'USD'): Money => ({
  amountCents: 0,
  currency,
});

export const formatMoney = (m: Money): string => {
  const symbol = m.currency === 'USD' ? '$' : m.currency === 'EUR' ? '€' : '£';
  const dollars = (m.amountCents / 100).toFixed(2);
  return `${symbol}${dollars}`;
};
