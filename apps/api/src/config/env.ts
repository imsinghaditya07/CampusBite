import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('file:../../packages/database/prisma/dev.db'),
  JWT_ACCESS_SECRET: z.string().default('campusbite_jwt_access_secret_super_secure_key_2026'),
  JWT_REFRESH_SECRET: z.string().default('campusbite_jwt_refresh_secret_super_secure_key_2026'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_campusbite2026'),
  RAZORPAY_KEY_SECRET: z.string().default('test_razorpay_secret_campusbite'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('test_webhook_secret_campusbite'),
  FRONTEND_URL: z.string().default('http://localhost:3005'),
  API_URL: z.string().default('http://localhost:4000'),
});

export const env = envSchema.parse(process.env);
