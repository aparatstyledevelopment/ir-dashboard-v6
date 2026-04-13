export function formatNumber(n, opts = {}) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('en-US', opts).format(n);
}

export function formatSignedInt(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  const sign = n > 0 ? '+' : n < 0 ? '−' : '';
  const abs = Math.abs(n);
  return `${sign}${formatNumber(abs)}`;
}

export function formatSignedPct(n, digits = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  const sign = n > 0 ? '+' : n < 0 ? '−' : '';
  const abs = Math.abs(n);
  return `${sign}${abs.toFixed(digits)}%`;
}

export function formatPct(n, digits = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return `${n.toFixed(digits)}%`;
}

export function formatCurrencyEUR(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return `€${formatNumber(n)}`;
}

export function formatPrice(n, currency = 'SEK', digits = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return `${n.toFixed(digits)} ${currency}`;
}

export function formatDateShort(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function dayName(date = new Date()) {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}
