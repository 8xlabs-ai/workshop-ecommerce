/**
 * Opaque payment token returned by payx-sdk after browser-side tokenization.
 * The server NEVER sees raw card data — only the prefixed token.
 */
export type PaymentToken = `tok_${string}`;

export interface PaymentCaptureResult {
  paymentRef: string;
  status: 'captured' | 'declined';
  declineReason?: string;
}
