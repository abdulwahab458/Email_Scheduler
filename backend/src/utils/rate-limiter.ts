import type Redis from 'ioredis';
import { env } from '../config/env';

const HOUR = 3600000;

export async function checkAndIncrementRateLimit(
  redis: Redis,
  senderEmail: string
): Promise<{ allowed: boolean; requeueDelayMs?: number }> {
  const now = Date.now();
  const hourWindow = Math.floor(now / HOUR) * HOUR;
  const key = `rate_limit:${senderEmail}:${hourWindow}`;

  const current = await redis.incr(key);
  await redis.expire(key, 7200);

  if (current > env.maxEmailsPerHour) {
    const nextWindowStart = hourWindow + HOUR;
    const delay = nextWindowStart - now;
    return { allowed: false, requeueDelayMs: delay };
  }

  return { allowed: true };
}
