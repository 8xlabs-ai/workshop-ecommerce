import { environment } from '../../../environments/environment.js';

/**
 * Browser OTel SDK bootstrap. Left as a stub for the workshop.
 * Production injects a tracer provider and a fetch instrumentation; the
 * frontend trace IDs are NOT propagated to the API yet (see KNOWN GAPS
 * in CLAUDE.md item 9).
 */
export const initTelemetry = (): void => {
  if (!environment.otelEnabled) return;
  // Real init goes here — kept out of the scaffold so devs see the seam.
};
