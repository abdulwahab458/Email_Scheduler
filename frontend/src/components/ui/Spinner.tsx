interface SpinnerProps {
  size?: 'sm' | 'md';
}

export function Spinner({ size = 'md' }: SpinnerProps) {
  const dim = size === 'sm' ? 'h-4 w-4' : 'h-8 w-8';
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 ${dim}`}
      role="status"
      aria-label="Loading"
    />
  );
}
