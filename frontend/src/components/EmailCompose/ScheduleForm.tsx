import { Input } from '../ui/Input';

interface ScheduleFormProps {
  scheduledAt: string;
  delayMs: number;
  maxPerHour: number;
  onScheduledAtChange: (value: string) => void;
  onDelayChange: (value: number) => void;
  onMaxPerHourChange: (value: number) => void;
}

export function ScheduleForm({
  scheduledAt,
  delayMs,
  maxPerHour,
  onScheduledAtChange,
  onDelayChange,
  onMaxPerHourChange,
}: ScheduleFormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Input
        label="Send at"
        type="datetime-local"
        value={scheduledAt}
        onChange={(e) => onScheduledAtChange(e.target.value)}
      />
      <Input
        label="Delay between emails (ms)"
        type="number"
        min={0}
        value={delayMs}
        onChange={(e) => onDelayChange(Number(e.target.value))}
      />
      <Input
        label="Max emails per hour"
        type="number"
        min={1}
        value={maxPerHour}
        onChange={(e) => onMaxPerHourChange(Number(e.target.value))}
      />
    </div>
  );
}
