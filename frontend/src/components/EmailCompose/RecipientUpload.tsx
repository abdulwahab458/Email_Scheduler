import { useState, type ChangeEvent } from 'react';

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
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
      <p className="mb-2 text-sm font-medium text-slate-700">Recipients (CSV)</p>
      <input type="file" accept=".csv,text/csv" onChange={handleFile} disabled={loading} />
      {count != null ? (
        <p className="mt-2 text-sm text-slate-600">{count} recipient(s) parsed</p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
