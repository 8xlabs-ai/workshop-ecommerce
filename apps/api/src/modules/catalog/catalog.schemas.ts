import { z } from 'zod';

export const listQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(60).default(24),
  category: z.enum(['home', 'apparel', 'electronics']).optional(),
});

export const productIdParam = z.object({
  id: z.string().uuid(),
});
