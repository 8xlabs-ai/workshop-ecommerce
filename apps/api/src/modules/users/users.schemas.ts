import { z } from 'zod';

export const loginBody = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128),
});

export const registerBody = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(64),
  lastName: z.string().min(1).max(64),
});

export type LoginInput = z.infer<typeof loginBody>;
export type RegisterInput = z.infer<typeof registerBody>;
