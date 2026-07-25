import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-violet-600 text-white shadow-lg shadow-violet-900/40 hover:bg-violet-500 active:scale-[0.98]',
  secondary:
    'border border-white/10 bg-zinc-800/80 text-zinc-100 hover:border-white/20 hover:bg-zinc-800',
  ghost: 'bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white',
};

export function Button({
  variant = 'primary',
  loading,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  );
}
