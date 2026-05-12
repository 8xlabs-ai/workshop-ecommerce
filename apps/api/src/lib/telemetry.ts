import { trace, type Span, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('shopstream-api');

/**
 * Wrap any external call (DB, HTTP, payx-sdk, redis) in this helper so the
 * span is created, attributes are attached, and errors are recorded uniformly.
 *
 * Example:
 *   await withSpan('payx.capture', async (span) => {
 *     span.setAttribute('amount.cents', amountCents);
 *     return payxClient.capture(token, amountCents);
 *   });
 */
export async function withSpan<T>(name: string, fn: (span: Span) => Promise<T>): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err instanceof Error ? err.message : String(err),
      });
      throw err;
    } finally {
      span.end();
    }
  });
}
