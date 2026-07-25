import type { ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({ message, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="surface-card flex flex-col items-center justify-center gap-4 border-dashed py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl text-violet-300 ring-1 ring-violet-500/20">
        {icon ?? '📭'}
      </div>
      <p className="max-w-sm text-sm text-zinc-400">{message}</p>
      {actionLabel && onAction ? (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
