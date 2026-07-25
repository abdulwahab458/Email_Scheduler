export type ScheduledEmailStatus = 'scheduled' | 'queued' | 'sent' | 'failed';

export interface ScheduledEmail {
  id: string;
  recipient_email: string;
  sender_email: string;
  subject: string;
  scheduled_at: string;
  status: ScheduledEmailStatus;
  sent_at: string | null;
  error_message: string | null;
}

export interface ScheduleEmailPayload {
  recipients: string[];
  subject: string;
  body: string;
  scheduledAt: string;
  delayBetweenEmailsMs?: number;
  maxEmailsPerHour?: number;
}
