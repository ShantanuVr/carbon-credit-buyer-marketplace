import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_REGISTRY_API_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_ADAPTER_API_URL: z.string().url().default('http://localhost:3001'),
  NEXT_PUBLIC_EXPLORER_BASE_URL: z.string().url().default('http://localhost:3002'),
  NEXT_PUBLIC_BRAND_NAME: z.string().default('Carbon Market (Demo)'),
  COOKIE_NAME: z.string().default('buyer_sess'),
  COOKIE_SECURE: z.string().transform(val => val === 'true').default('false'),
  DEMO_MODE: z.string().transform(val => val === 'true').default('true'),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_REGISTRY_API_URL: process.env.NEXT_PUBLIC_REGISTRY_API_URL || 'http://localhost:3000',
  NEXT_PUBLIC_ADAPTER_API_URL: process.env.NEXT_PUBLIC_ADAPTER_API_URL || 'http://localhost:3001',
  NEXT_PUBLIC_EXPLORER_BASE_URL: process.env.NEXT_PUBLIC_EXPLORER_BASE_URL || 'http://localhost:3002',
  NEXT_PUBLIC_BRAND_NAME: process.env.NEXT_PUBLIC_BRAND_NAME || 'Carbon Market (Demo)',
  COOKIE_NAME: process.env.COOKIE_NAME || 'buyer_sess',
  COOKIE_SECURE: process.env.COOKIE_SECURE || 'false',
  DEMO_MODE: process.env.DEMO_MODE || 'true',
})

export type Env = z.infer<typeof envSchema>