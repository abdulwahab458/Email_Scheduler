import type { ScheduledEmailStatus } from '../../types/email';

const styles: Record<ScheduledEmailStatus, string> = {
  scheduled: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  queued: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  sent: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  failed: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
};

interface StatusBadgeProps {
  status: ScheduledEmailStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${styles[status]}`}
    >
      {status}
    </span>
  );
}
