import type { ReactNode } from 'react';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="surface-card relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
            <p className="mt-1 text-sm text-zinc-400">Configure recipients and delivery timing.</p>
          </div>
          <Button variant="ghost" className="shrink-0 px-3" onClick={onClose}>
            ✕
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
