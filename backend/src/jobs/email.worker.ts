import { Worker } from 'bullmq';
import nodemailer from "nodemailer";
import { createRedisConnection } from '../config/redis';
import { env } from '../config/env';
import ScheduledEmail from '../models/ScheduledEmail';
import EmailLog from '../models/EmailLog';
import Sender from '../models/Sender';
import { emailQueue } from '../queues/email.queue';
import { createTransport } from '../services/ethereal.service';
import { checkAndIncrementRateLimit } from '../utils/rate-limiter';
import type { ScheduleEmailJobData } from '../types';

const connection = createRedisConnection();

export function startEmailWorker(): Worker<ScheduleEmailJobData> {
  const worker = new Worker<ScheduleEmailJobData>(
    'email-sending',
    async (job) => {
      const { scheduledEmailId } = job.data;
      const record = await ScheduledEmail.findByPk(scheduledEmailId);
      if (!record || record.status === 'sent') {
        return;
      }

      const rate = await checkAndIncrementRateLimit(connection, record.sender_email);
      if (!rate.allowed && rate.requeueDelayMs != null) {
        await emailQueue.add('send-email', job.data, { delay: rate.requeueDelayMs });
        return;
      }

      const sender = await Sender.findOne({
        where: { email: record.sender_email, is_active: true },
      });
      if (!sender) {
        await record.update({
          status: 'failed',
          error_message: 'No active sender found',
        });
        return;
      }

      const transport = createTransport(sender);
      console.log("SMTP Host:", sender.smtp_host);
      console.log("SMTP Port:", sender.smtp_port);


      try {
        console.log("Step 1: Before verify");

        await transport.verify();
    
        console.log("Step 2: Verify successful");
    
        console.log("Step 3: Before sendMail");
        const info = await transport.sendMail({
          from: record.sender_email,
          to: record.recipient_email,
          subject: record.subject,
          html: record.body,
        });
        console.log("Message ID:", info.messageId);
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

        const sentAt = new Date();
        await record.update({ status: 'sent', sent_at: sentAt, error_message: null });
        await EmailLog.create({
          scheduled_email_id: record.id,
          sender_id: sender.id,
          status: 'sent',
          sent_at: sentAt,
          response: { messageId: info.messageId },
          error: null,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Send failed';
        await record.update({ status: 'failed', error_message: message });
        await EmailLog.create({
          scheduled_email_id: record.id,
          sender_id: sender.id,
          status: 'failed',
          sent_at: new Date(),
          response: null,
          error: message,
        });
        throw err;
      }
    },
    {
      connection,
      concurrency: env.workerConcurrency,
      limiter: {
        max: 1,
        duration: env.minDelayBetweenEmailsMs,
      },
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
  });

  return worker;
}








