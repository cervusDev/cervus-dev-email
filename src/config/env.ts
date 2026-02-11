import 'dotenv/config';
import { z } from 'zod';
import { EEnvironment } from './enums';

const envSchema = z.object({
  NODE_ENV: z.enum([
    EEnvironment.DEVELOPMENT,
    EEnvironment.PRODUCTION,
    EEnvironment.TESTING,
  ]),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),

  ETHEREAL_HOST: z.string(),
  ETHEREAL_PORT: z.string(),
  ETHEREAL_USERNAME: z.string(),
  ETHEREAL_PASSWORD: z.string(),

  PORT: z.string(),
});

export const envConfig = envSchema.parse(process.env);
