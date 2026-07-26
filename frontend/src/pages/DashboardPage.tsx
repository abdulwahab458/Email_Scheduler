import { useMemo, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { ComposeModal } from '../components/EmailCompose/ComposeModal';
import { ScheduledTable } from '../components/EmailList/ScheduledTable';
import { SentTable } from '../components/EmailList/SentTable';
import { useEmails } from '../hooks/useEmails';

const TABS = [
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'sent', label: 'Sent' },
];

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: number;
  hint: string;
  accent: string;
}) {
  return (
    <div className="surface-card p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${accent}`}>{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{hint}</p>
    </div>
  );
}

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState('scheduled');
  const [composeOpen, setComposeOpen] = useState(false);
  const {
    scheduled,
    sent,
    loadingScheduled,
    loadingSent,
    error,
    reloadScheduled,
    reloadSent,
    scheduledPage,
    scheduledTotal,
    sentPage,
    sentTotal,
    limit,
    goToScheduledPage,
    goToSentPage,
  } = useEmails();

  const sentCount = useMemo(() => sent.filter((e) => e.status === 'sent').length, [sent]);
  const failedCount = useMemo(() => sent.filter((e) => e.status === 'failed').length, [sent]);

  function handleScheduled() {
    void reloadScheduled();
    void reloadSent();
  }

  return (
    <>
      <DashboardLayout
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={
          <Button onClick={() => setComposeOpen(true)}>+ Compose batch</Button>
        }
        stats={
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Scheduled"
              value={scheduled.length}
              hint="Waiting to send"
              accent="text-sky-300"
            />
            <StatCard
              label="Delivered"
              value={sentCount}
              hint="Successfully sent"
              accent="text-emerald-300"
            />
            <StatCard
              label="Failed"
              value={failedCount}
              hint="Needs attention"
              accent="text-rose-300"
            />
          </div>
        }
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">
            {activeTab === 'scheduled' ? 'Upcoming deliveries' : 'Delivery history'}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {activeTab === 'scheduled'
              ? 'Emails queued for future send times.'
              : 'Past sends including failures and timestamps.'}
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {activeTab === 'scheduled' ? (
          <ScheduledTable
            rows={scheduled}
            loading={loadingScheduled}
            page={scheduledPage}
            total={scheduledTotal}
            limit={limit}
            onPageChange={goToScheduledPage}
          />
        ) : (
          <SentTable
            rows={sent}
            loading={loadingSent}
            page={sentPage}
            total={sentTotal}
            limit={limit}
            onPageChange={goToSentPage}
          />
        )}
      </DashboardLayout>

      <ComposeModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onScheduled={handleScheduled}
      />
    </>
  );
}
