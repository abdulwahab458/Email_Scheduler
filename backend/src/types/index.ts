export type ScheduledEmailStatus = 'scheduled' | 'queued' | 'sent' | 'failed';
export type EmailLogStatus = 'sent' | 'failed';

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface ScheduleEmailJobData {
  scheduledEmailId: string;
}
