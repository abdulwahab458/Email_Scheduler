export function parseRecipientCsv(buffer: Buffer): string[] {
  const text = buffer.toString('utf-8');
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const emails: string[] = [];

  for (const line of lines) {
    const parts = line.split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
    const candidate = parts.find((p) => p.includes('@')) ?? parts[0];
    if (candidate && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate)) {
      emails.push(candidate.toLowerCase());
    }
  }

  return [...new Set(emails)];
}
