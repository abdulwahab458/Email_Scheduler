import { Table } from '../ui/Table';
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
      emptyMessage="No scheduled emails yet"
      columns={[
        { key: 'recipient_email', header: 'Recipient' },
        { key: 'subject', header: 'Subject' },
        {
          key: 'scheduled_at',
          header: 'Scheduled',
          render: (row) => new Date(row.scheduled_at).toLocaleString(),
        },
        { key: 'status', header: 'Status' },
      ]}
    />
  );
}
