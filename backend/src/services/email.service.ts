import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import ScheduledEmail from '../models/ScheduledEmail';
import { emailQueue } from '../queues/email.queue';

export interface ScheduleBatchInput {
  userId: string;
  recipients: string[];
  subject: string;
  body: string;
  scheduledAt: Date;
  senderEmail: string;
}

export async function scheduleEmailBatch(input: ScheduleBatchInput) {
  const batchId = uuidv4();
  const records = [];

  const delay = Math.max(0, input.scheduledAt.getTime() - Date.now());
  for (const recipient of input.recipients) {
    const idempotencyKey = `${batchId}:${recipient.trim().toLowerCase()}`;
    const record = await ScheduledEmail.create({
      user_id: input.userId,
      sender_email: input.senderEmail,
      recipient_email: recipient,
      subject: input.subject,
      body: input.body,
      scheduled_at: input.scheduledAt,
      status: 'scheduled',
      idempotency_key: idempotencyKey,
      batch_id: batchId,
    });
    records.push(record);

    await emailQueue.add(
      'send-email',
      { scheduledEmailId: record.id },
      { delay, jobId: record.id }
    );
    await record.update({ status: 'queued' });
  }

  return { batchId, count: records.length };
}

export async function listScheduledEmails(userId: string, page: number, limit: number) {
  const offset = (page - 1) * limit;
  const { rows, count } = await ScheduledEmail.findAndCountAll({
    where: { user_id: userId, status: { [Op.in]: ['scheduled', 'queued'] } },
    order: [['scheduled_at', 'ASC']],
    limit,
    offset,
  });
  return { items: rows, total: count, page, limit };
}

export async function listSentEmails(userId: string, page: number, limit: number) {
  const offset = (page - 1) * limit;
  const { rows, count } = await ScheduledEmail.findAndCountAll({
    where: { user_id: userId, status: { [Op.in]: ['sent', 'failed'] } },
    order: [['sent_at', 'DESC']],
    limit,
    offset,
  });
  return { items: rows, total: count, page, limit };
}
