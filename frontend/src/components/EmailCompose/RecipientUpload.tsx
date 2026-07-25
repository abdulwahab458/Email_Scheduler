import { useState, type ChangeEvent } from 'react';
import { Spinner } from '../ui/Spinner';

interface RecipientUploadProps {
  onParsed: (recipients: string[], count: number) => void;
  onUpload: (file: File) => Promise<{ count: number; recipients: string[] }>;
}

export function RecipientUpload({ onParsed, onUpload }: RecipientUploadProps) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await onUpload(file);
      setCount(result.count);
      onParsed(result.recipients, result.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-white/15 bg-zinc-950/50 p-4">
      <p className="mb-2 text-sm font-medium text-zinc-300">Recipients (CSV)</p>
      <p className="mb-3 text-xs text-zinc-500">Upload a CSV with one email per row or column.</p>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-violet-500/40 hover:bg-zinc-800">
        {loading ? <Spinner size="sm" /> : null}
        Choose file
        <input
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleFile}
          disabled={loading}
        />
      </label>
      {count != null ? (
        <p className="mt-3 text-sm text-emerald-400">{count} recipient(s) parsed successfully</p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
