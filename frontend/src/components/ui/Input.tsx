import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, icon, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <label className="block space-y-1.5 text-sm">
      {label ? <span className="label-text">{label}</span> : null}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
            {icon}
          </span>
        ) : null}
        <input
          id={inputId}
          className={`input-field ${icon ? 'pl-10' : ''} ${error ? 'border-rose-500/60 ring-rose-500/20' : ''} ${className}`}
          {...props}
        />
      </div>
      {error ? <p className="text-xs text-rose-400">{error}</p> : null}
    </label>
  );
}
