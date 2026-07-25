import type { ReactNode } from 'react';
import { Header } from './Header';
import { PageBackground } from './BrandMark';

interface DashboardLayoutProps {
  children: ReactNode;
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  actions?: ReactNode;
  stats?: ReactNode;
}

export function DashboardLayout({
  children,
  tabs,
  activeTab,
  onTabChange,
  actions,
  stats,
}: DashboardLayoutProps) {
  return (
    <div className="app-shell min-h-screen">
      <PageBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {stats}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <nav className="inline-flex w-fit rounded-xl border border-white/10 bg-zinc-900/80 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            {actions}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
