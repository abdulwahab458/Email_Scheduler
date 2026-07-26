import api from './api';
import type { ScheduledEmail, ScheduleEmailPayload } from '../types/email';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export async function scheduleEmails(payload: ScheduleEmailPayload) {
  const { data } = await api.post('/api/emails/schedule', payload);
  return data;
}

export async function fetchScheduled(page = 1, limit = 20) {
  const { data } = await api.get<PaginatedResponse<ScheduledEmail>>('/api/emails/scheduled', {
    params: { page, limit },
  });
  return data;
}

export async function fetchSent(page = 1, limit = 20) {
  const { data } = await api.get<PaginatedResponse<ScheduledEmail>>('/api/emails/sent', {
    params: { page, limit },
  });
  return data;
}

export async function parseCsv(file: File) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<{ count: number; recipients: string[] }>(
    '/api/emails/parse-csv',
    form
  );
  return data;
}
