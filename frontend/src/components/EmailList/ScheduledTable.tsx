import { Table } from '../ui/Table';
import { StatusBadge } from '../ui/StatusBadge';
import type { ScheduledEmail } from '../../types/email';

interface ScheduledTableProps {
  rows: ScheduledEmail[];
  loading?: boolean;
}

export function ScheduledTable({ rows, loading }: ScheduledTableProps) {
  return (
    <Table
      loading={loading}
      rows={rows}
      rowKey={(row) => row.id}
      emptyMessage="No scheduled emails yet — compose a batch to get started."
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
          key: 'scheduled_at',
          header: 'Scheduled',
          render: (row) => (
            <span className="tabular-nums text-zinc-400">
              {new Date(row.scheduled_at).toLocaleString()}
            </span>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          render: (row) => <StatusBadge status={row.status} />,
        },
      ]}
    />
  );
}
