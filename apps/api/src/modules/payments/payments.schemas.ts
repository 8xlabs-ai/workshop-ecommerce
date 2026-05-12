import { z } from 'zod';

export const webhookBody = z.object({
  type: z.enum(['charge.captured', 'charge.declined', 'charge.refunded']),
  data: z.object({
    id: z.string(),
    amount: z.number().int().nonnegative(),
    currency: z.string().length(3),
    metadata: z.record(z.string()).optional(),
  }),
});
