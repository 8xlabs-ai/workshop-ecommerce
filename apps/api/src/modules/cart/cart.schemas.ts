import { z } from 'zod';

export const addItemBody = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1).max(20),
  variant: z.string().max(40).optional(),
});

export const updateItemBody = z.object({
  quantity: z.coerce.number().int().min(0).max(20),
});

export const itemIdParam = z.object({
  id: z.string().uuid(),
});

export type AddItemInput = z.infer<typeof addItemBody>;
export type UpdateItemInput = z.infer<typeof updateItemBody>;
