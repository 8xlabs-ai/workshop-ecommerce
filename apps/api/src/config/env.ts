import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_ISSUER: z.string().default('shopstream-api'),

  FF_GUEST_CHECKOUT_ENABLED: z
    .string()
    .default('false')
    .transform((v) => v.toLowerCase() === 'true'),
  FF_ACCOUNT_UPSELL_AFTER_GUEST: z
    .string()
    .default('false')
    .transform((v) => v.toLowerCase() === 'true'),

  PAYX_API_KEY: z.string().min(1),
  PAYX_PUBLIC_KEY: z.string().min(1),
  PAYX_API_BASE: z.string().url(),

  OTEL_SERVICE_NAME: z.string().default('shopstream-api'),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

export const loadEnv = (): Env => {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // Cannot use logger yet — env required for logger setup.

    console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  cached = parsed.data;
  return cached;
};
