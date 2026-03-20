import { z } from "zod"

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
  AUTH_URL: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().min(1).optional(),
})

const parsed = envSchema.parse({
  MONGODB_URI: process.env.MONGODB_URI,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_URL: process.env.AUTH_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
})

export const env = {
  ...parsed,
  AUTH_URL: parsed.AUTH_URL ?? parsed.NEXTAUTH_URL,
}
