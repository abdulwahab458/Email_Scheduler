import { GoogleLoginButton } from '../components/Auth/GoogleLoginButton';
import { BrandMark, PageBackground } from '../components/layout/BrandMark';

const FEATURES = [
  'Schedule batches with BullMQ-backed delivery',
  'Track queued, sent, and failed messages',
  'Upload recipient lists from CSV',
];

export function LoginPage() {
  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-12">
      <PageBackground />

      <div className="relative z-10 grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="hidden lg:block">
          <BrandMark size="lg" />
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-white">
            Send smarter,
            <span className="block bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
              on your schedule
            </span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-400">
            Plan email campaigns, respect rate limits, and monitor delivery from one dark, focused
            dashboard.
          </p>
          <ul className="mt-8 space-y-3">
            {FEATURES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-zinc-300">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs text-emerald-400 ring-1 ring-emerald-500/30">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="surface-card mx-auto w-full max-w-md p-8 sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="lg:hidden">
              <BrandMark />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Sign in with Google to open your email scheduler dashboard.
            </p>
          </div>

          <div className="flex justify-center lg:justify-start">
            <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-3">
              <GoogleLoginButton />
            </div>
          </div>

          <p className="mt-8 text-center text-xs leading-relaxed text-zinc-500 lg:text-left">
            By continuing, you agree to use this workspace for scheduling test emails via Ethereal
            SMTP in development.
          </p>
        </div>
      </div>
    </div>
  );
}
