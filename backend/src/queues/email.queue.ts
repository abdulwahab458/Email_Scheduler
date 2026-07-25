import { Queue } from 'bullmq';
import { createRedisConnection } from '../config/redis';
import type { ScheduleEmailJobData } from '../types';

const connection = createRedisConnection();

export const emailQueue = new Queue<ScheduleEmailJobData>('email-sending', {
  connection,
  defaultJobOptions: {
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
  },
});

export { connection as queueConnection };
