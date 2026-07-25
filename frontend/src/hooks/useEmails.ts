import { useCallback, useEffect, useState } from 'react';
import { fetchScheduled, fetchSent } from '../services/email.service';
import type { ScheduledEmail } from '../types/email';

export function useEmails() {
  const [scheduled, setScheduled] = useState<ScheduledEmail[]>([]);
  const [sent, setSent] = useState<ScheduledEmail[]>([]);
  const [loadingScheduled, setLoadingScheduled] = useState(true);
  const [loadingSent, setLoadingSent] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadScheduled = useCallback(async () => {
    setLoadingScheduled(true);
    setError(null);
    try {
      const data = await fetchScheduled();
      setScheduled(data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load scheduled emails');
    } finally {
      setLoadingScheduled(false);
    }
  }, []);

  const reloadSent = useCallback(async () => {
    setLoadingSent(true);
    setError(null);
    try {
      const data = await fetchSent();
      setSent(data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load sent emails');
    } finally {
      setLoadingSent(false);
    }
  }, []);

  useEffect(() => {
    void reloadScheduled();
    void reloadSent();
  }, [reloadScheduled, reloadSent]);

  return {
    scheduled,
    sent,
    loadingScheduled,
    loadingSent,
    error,
    reloadScheduled,
    reloadSent,
  };
}
