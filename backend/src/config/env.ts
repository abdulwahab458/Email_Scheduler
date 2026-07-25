import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });


export const env = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL!,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  jwtSecret: process.env.JWT_SECRET!,
  expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  maxEmailsPerHour: Number(process.env.MAX_EMAILS_PER_HOUR || 200),
  minDelayBetweenEmailsMs: Number(process.env.MIN_DELAY_BETWEEN_EMAILS_MS || 2000),
  workerConcurrency: Number(process.env.WORKER_CONCURRENCY || 5),
};
