import type { ReactNode } from 'react';
import { EmptyState } from './EmptyState';
import { Spinner } from './Spinner';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey: (row: T) => string;
}

export function Table<T>({
  columns,
  rows,
  loading,
  emptyMessage = 'No data yet',
  rowKey,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="surface-card flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!rows.length) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-zinc-400">
              {columns.map((col) => (
                <th key={String(col.key)} className="px-5 py-3.5 font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="transition-colors hover:bg-white/[0.03]">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-5 py-4 text-zinc-300">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key as string] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
