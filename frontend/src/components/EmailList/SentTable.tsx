import { Table } from '../ui/Table';
import { StatusBadge } from '../ui/StatusBadge';
import type { ScheduledEmail } from '../../types/email';

interface SentTableProps {
  rows: ScheduledEmail[];
  loading?: boolean;
}

export function SentTable({ rows, loading }: SentTableProps) {
  return (
    <Table
      loading={loading}
      rows={rows}
      rowKey={(row) => row.id}
      emptyMessage="No sent emails yet."
      columns={[
        {
          key: 'recipient_email',
          header: 'Recipient',
          render: (row) => (
            <span className="font-medium text-zinc-200">{row.recipient_email}</span>
          ),
        },
        {
          key: 'subject',
          header: 'Subject',
          render: (row) => (
            <span className="max-w-xs truncate block text-zinc-400" title={row.subject}>
              {row.subject}
            </span>
          ),
        },
        {
          key: 'sent_at',
          header: 'Sent at',
          render: (row) => (
            <span className="tabular-nums text-zinc-400">
              {row.sent_at ? new Date(row.sent_at).toLocaleString() : '—'}
            </span>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          render: (row) => <StatusBadge status={row.status} />,
        },
        {
          key: 'error_message',
          header: 'Error',
          render: (row) => (
            <span className="max-w-xs truncate text-rose-300/90" title={row.error_message ?? ''}>
              {row.error_message ?? '—'}
            </span>
          ),
        },
      ]}
    />
  );
}
