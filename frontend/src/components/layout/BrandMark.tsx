function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

export function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-14 w-14' : size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  const icon = size === 'lg' ? 'h-7 w-7' : size === 'sm' ? 'h-5 w-5' : 'h-6 w-6';
  return (
    <div
      className={`flex ${box} items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-900/50 ring-1 ring-white/20`}
    >
      <MailIcon className={icon} />
    </div>
  );
}

export function PageBackground() {
  return (
    <>
      <div className="app-glow -left-32 top-0 h-96 w-96 bg-violet-600" />
      <div className="app-glow right-0 top-1/4 h-80 w-80 bg-indigo-600" />
      <div className="app-glow bottom-0 left-1/3 h-72 w-72 bg-fuchsia-700/80" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.06) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
    </>
  );
}
