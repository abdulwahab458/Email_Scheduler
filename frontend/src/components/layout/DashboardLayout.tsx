import type { ReactNode } from 'react';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  actions?: ReactNode;
}

export function DashboardLayout({
  children,
  tabs,
  activeTab,
  onTabChange,
  actions,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex gap-2 rounded-lg bg-white p-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          {actions}
        </div>
        {children}
      </div>
    </div>
  );
}
