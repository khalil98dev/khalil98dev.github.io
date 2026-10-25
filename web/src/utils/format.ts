export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' }) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', opts);
}

export function year(iso: string) {
  return new Date(iso).getFullYear();
}
