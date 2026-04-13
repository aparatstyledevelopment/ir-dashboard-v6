// Helpers to build shareContent ({ title, text, csv }) from a card's data.

import { rowsToCsv } from './csv';

// Build shareContent from a plain narrative + optional table.
// columns: [{ header, key, format? }]
// rows: any[]
export function buildShareContent({ title, narrative, columns, rows }) {
  let csv = null;
  if (columns && rows && rows.length > 0) {
    const headers = columns.map((c) => c.header);
    const rowValues = rows.map((r) =>
      columns.map((c) => {
        const raw = c.key ? r[c.key] : c.value ? c.value(r) : '';
        if (typeof c.format === 'function') return c.format(raw, r);
        return raw;
      })
    );
    csv = rowsToCsv(headers, rowValues);
  }
  return {
    title,
    text: [title, narrative].filter(Boolean).join('\n\n'),
    csv,
  };
}

// Build shareContent from a catalog entry body spec (used by
// DynamicResponseCard). Handles every body type in the catalog.
export function shareContentFromCatalogEntry(entry) {
  if (!entry) return null;
  const title = entry.title || 'Card';
  const narrative = entry.narrative || '';
  const body = entry.body;

  let csv = null;
  if (body) {
    switch (body.type) {
      case 'table': {
        const headers = body.columns.map((c) => c.header);
        const values = body.rows.map((r) =>
          body.columns.map((c) => (c.key ? r[c.key] : ''))
        );
        csv = rowsToCsv(headers, values);
        break;
      }
      case 'bars':
      case 'donut':
      case 'stacked':
      case 'waterfall': {
        csv = rowsToCsv(
          ['Label', 'Value'],
          (body.data || []).map((d) => [d.label, d.value])
        );
        break;
      }
      case 'bubbles': {
        csv = rowsToCsv(
          ['Label', 'X', 'Y', 'Size', 'Priority'],
          (body.data || []).map((d) => [d.label, d.x, d.y, d.size, d.priority])
        );
        break;
      }
      case 'metrics': {
        csv = rowsToCsv(
          ['Label', 'Value', 'Note'],
          (body.items || []).map((m) => [m.label, m.value, m.sub || ''])
        );
        break;
      }
      case 'kv': {
        csv = rowsToCsv(
          ['Label', 'Value'],
          (body.items || []).map((m) => [m.label, m.value])
        );
        break;
      }
      case 'list': {
        csv = rowsToCsv(
          ['Key', 'Description', 'Note'],
          (body.items || []).map((m) => [m.left, m.right, m.sub || ''])
        );
        break;
      }
      case 'ring': {
        csv = rowsToCsv(
          ['Metric', 'Value', 'Max'],
          [[body.label || 'Value', body.value, body.max || 100]]
        );
        break;
      }
      default:
        csv = null;
    }
  }

  const text = [
    title,
    entry.source ? `Source: ${entry.source}` : null,
    narrative,
  ]
    .filter(Boolean)
    .join('\n\n');

  return { title, text, csv };
}
