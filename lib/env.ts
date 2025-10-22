import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_REGISTRY_API_URL: z.string().url(),
  NEXT_PUBLIC_ADAPTER_API_URL: z.string().url(),
  NEXT_PUBLIC_EXPLORER_BASE_URL: z.string().url(),
  NEXT_PUBLIC_BRAND_NAME: z.string().default('Carbon Market (Demo)'),
  COOKIE_NAME: z.string().default('buyer_sess'),
  COOKIE_SECURE: z.string().transform(val => val === 'true').default('false'),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_REGISTRY_API_URL: process.env.NEXT_PUBLIC_REGISTRY_API_URL,
  NEXT_PUBLIC_ADAPTER_API_URL: process.env.NEXT_PUBLIC_ADAPTER_API_URL,
  NEXT_PUBLIC_EXPLORER_BASE_URL: process.env.NEXT_PUBLIC_EXPLORER_BASE_URL,
  NEXT_PUBLIC_BRAND_NAME: process.env.NEXT_PUBLIC_BRAND_NAME,
  COOKIE_NAME: process.env.COOKIE_NAME,
  COOKIE_SECURE: process.env.COOKIE_SECURE,
})

export type Env = z.infer<typeof envSchema>
