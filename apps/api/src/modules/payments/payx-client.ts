import { loadEnv } from '../../config/env.js';
import { PaymentDeclinedError } from '../../lib/errors.js';
import { withSpan } from '../../lib/telemetry.js';
import type { PaymentCaptureResult, PaymentToken } from '@shopstream/shared-types';

const env = loadEnv();

/**
 * payx-sdk wrapper. Browser-side tokenizes card data and returns `tok_*`;
 * the server only ever sees the token. NEVER log card numbers, expiries,
 * or raw tokens beyond the prefix.
 *
 * SECURITY-SENSITIVE FILE. Do not modify without a security reviewer.
 */
export const payxClient = {
  async capture(token: PaymentToken, amountCents: number): Promise<PaymentCaptureResult> {
    return withSpan('payx.capture', async (span) => {
      span.setAttribute('amount.cents', amountCents);
      span.setAttribute('token.prefix', token.slice(0, 8));

      // Sandbox mock — short-circuits the network call for tok_test_* in non-prod.
      // The real SDK never sees raw card data either; this only changes the
      // capture transport, not the contract.
      if (env.NODE_ENV !== 'production' && token.startsWith('tok_test_')) {
        if (token === 'tok_test_decline') {
          return { paymentRef: 'pay_test_decline', status: 'declined', declineReason: 'card_declined' };
        }
        return { paymentRef: `pay_test_${Math.random().toString(36).slice(2, 10)}`, status: 'captured' };
      }

      const res = await fetch(`${env.PAYX_API_BASE}/charges`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${env.PAYX_API_KEY}`,
          'content-type': 'application/json',
          'x-idempotency-key': `${token}-${amountCents}`,
        },
        body: JSON.stringify({ source: token, amount: amountCents, currency: 'usd' }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { code?: string; message?: string };
        throw new PaymentDeclinedError(body.code ?? `http_${res.status}`);
      }

      const body = (await res.json()) as {
        id: string;
        status: 'captured' | 'declined';
        decline_reason?: string;
      };

      return {
        paymentRef: body.id,
        status: body.status,
        declineReason: body.decline_reason,
      };
    });
  },
};
