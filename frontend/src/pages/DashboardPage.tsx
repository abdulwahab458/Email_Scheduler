import { useState } from 'react';
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

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState('scheduled');
  const [composeOpen, setComposeOpen] = useState(false);
  const { scheduled, sent, loadingScheduled, loadingSent, reloadScheduled, reloadSent } =
    useEmails();

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
          <Button onClick={() => setComposeOpen(true)}>Compose email batch</Button>
        }
      >
        {activeTab === 'scheduled' ? (
          <ScheduledTable rows={scheduled} loading={loadingScheduled} />
        ) : (
          <SentTable rows={sent} loading={loadingSent} />
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
