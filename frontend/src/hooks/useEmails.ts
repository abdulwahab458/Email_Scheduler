import { useCallback, useEffect, useState } from 'react';
import { fetchScheduled, fetchSent } from '../services/email.service';
import type { ScheduledEmail } from '../types/email';

const PAGE_LIMIT = 20;

export function useEmails() {
  const [scheduled, setScheduled] = useState<ScheduledEmail[]>([]);
  const [sent, setSent] = useState<ScheduledEmail[]>([]);
  const [loadingScheduled, setLoadingScheduled] = useState(true);
  const [loadingSent, setLoadingSent] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [scheduledPage, setScheduledPage] = useState(1);
  const [scheduledTotal, setScheduledTotal] = useState(0);
  const [sentPage, setSentPage] = useState(1);
  const [sentTotal, setSentTotal] = useState(0);

  const reloadScheduled = useCallback(async (page = 1) => {
    setLoadingScheduled(true);
    setError(null);
    try {
      const data = await fetchScheduled(page, PAGE_LIMIT);
      setScheduled(data.items);
      setScheduledTotal(data.total);
      setScheduledPage(data.page);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load scheduled emails');
    } finally {
      setLoadingScheduled(false);
    }
  }, []);

  const reloadSent = useCallback(async (page = 1) => {
    setLoadingSent(true);
    setError(null);
    try {
      const data = await fetchSent(page, PAGE_LIMIT);
      setSent(data.items);
      setSentTotal(data.total);
      setSentPage(data.page);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load sent emails');
    } finally {
      setLoadingSent(false);
    }
  }, []);

  useEffect(() => {
    void reloadScheduled(1);
    void reloadSent(1);
  }, [reloadScheduled, reloadSent]);

  return {
    scheduled,
    sent,
    loadingScheduled,
    loadingSent,
    error,
    reloadScheduled,
    reloadSent,
    scheduledPage,
    scheduledTotal,
    sentPage,
    sentTotal,
    limit: PAGE_LIMIT,
    goToScheduledPage: (page: number) => reloadScheduled(page),
    goToSentPage: (page: number) => reloadSent(page),
  };
}
