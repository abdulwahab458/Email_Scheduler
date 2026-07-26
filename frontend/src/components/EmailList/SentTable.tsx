import { Table } from '../ui/Table';
import { StatusBadge } from '../ui/StatusBadge';
import type { ScheduledEmail } from '../../types/email';

interface SentTableProps {
  rows: ScheduledEmail[];
  loading?: boolean;
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function SentTable({ rows, loading, page, total, limit, onPageChange }: SentTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
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
      {!loading && total > 0 && (
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <span>
            Page {page} of {totalPages} ({total} total)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border border-white/10 px-3 py-1.5 transition-colors hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border border-white/10 px-3 py-1.5 transition-colors hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
