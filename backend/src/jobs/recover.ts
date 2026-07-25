import { Op } from 'sequelize';
import ScheduledEmail from '../models/ScheduledEmail';
import { emailQueue } from '../queues/email.queue';

export async function recoverScheduledEmails(): Promise<number> {
  const pending = await ScheduledEmail.findAll({
    where: { status: { [Op.in]: ['scheduled', 'queued'] } },
  });

  let recovered = 0;
  for (const record of pending) {
    const existing = await emailQueue.getJob(record.id);
    if (existing) continue;

    const delay = Math.max(0, record.scheduled_at.getTime() - Date.now());
    await emailQueue.add(
      'send-email',
      { scheduledEmailId: record.id },
      { delay, jobId: record.id }
    );
    if (record.status === 'scheduled') {
      await record.update({ status: 'queued' });
    }
    recovered += 1;
  }

  return recovered;
}
