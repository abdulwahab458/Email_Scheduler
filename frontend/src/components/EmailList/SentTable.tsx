import { Table } from '../ui/Table';
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
      emptyMessage="No sent emails yet"
      columns={[
        { key: 'recipient_email', header: 'Recipient' },
        { key: 'subject', header: 'Subject' },
        {
          key: 'sent_at',
          header: 'Sent at',
          render: (row) => (row.sent_at ? new Date(row.sent_at).toLocaleString() : '—'),
        },
        { key: 'status', header: 'Status' },
        {
          key: 'error_message',
          header: 'Error',
          render: (row) => row.error_message ?? '—',
        },
      ]}
    />
  );
}
