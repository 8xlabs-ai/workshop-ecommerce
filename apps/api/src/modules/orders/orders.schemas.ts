import { z } from 'zod';

export const orderIdParam = z.object({
  id: z.string().uuid(),
});

export const guestLookupQuery = z.object({
  email: z.string().email().toLowerCase(),
});
