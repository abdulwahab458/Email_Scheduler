import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { RecipientUpload } from './RecipientUpload';
import { ScheduleForm } from './ScheduleForm';
import { parseCsv, scheduleEmails } from '../../services/email.service';
import { toast } from 'react-toastify';

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
  onScheduled: () => void;
}

export function ComposeModal({ open, onClose, onScheduled }: ComposeModalProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState('');
  const [delayMs, setDelayMs] = useState(2000);
  const [maxPerHour, setMaxPerHour] = useState(200);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!recipients.length || !subject || !body || !scheduledAt) {
      setError('Fill in subject, body, schedule time, and at least one recipient.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await scheduleEmails({
        recipients,
        subject,
        body,
        scheduledAt: new Date(scheduledAt).toISOString(),
        delayBetweenEmailsMs: delayMs,
        maxEmailsPerHour: maxPerHour,
      });
      onScheduled();
      onClose();
      toast.success('Email batch scheduled successfully');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to schedule emails');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} title="Compose email batch" onClose={onClose}>
      <div className="space-y-5">
        <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <label className="block space-y-1.5 text-sm">
          <span className="label-text">Body (HTML)</span>
          <textarea
            className="input-field min-h-36 resize-y font-mono text-xs leading-relaxed"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="<p>Hello...</p>"
          />
        </label>
        <RecipientUpload onUpload={parseCsv} onParsed={(list) => setRecipients(list)} />
        <ScheduleForm
          scheduledAt={scheduledAt}
          delayMs={delayMs}
          maxPerHour={maxPerHour}
          onScheduledAtChange={setScheduledAt}
          onDelayChange={setDelayMs}
          onMaxPerHourChange={setMaxPerHour}
        />
        {error ? (
          <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        ) : null}
        <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={loading} onClick={handleSubmit}>
            Schedule batch
          </Button>
        </div>
      </div>
    </Modal>
  );
}
