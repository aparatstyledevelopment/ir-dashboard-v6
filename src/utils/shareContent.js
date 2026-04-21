// Helpers to build shareContent from a card's data.
//
// The returned share object is used across the app for:
//   - the per-card Share menu (copy text / download CSV / PDF)
//   - /report aggregated PDF generation
//   - the Artifacts pane "View source data" evidence view
//
// Shape:
//   {
//     title: string,
//     narrative?: string,
//     sourceQuery?: string,     // pseudo-SQL / natural-language query
//     columns?: [{ header, key, format? }],
//     rows?: any[],             // raw rows (format-preserving)
//     text: string,             // flattened text for clipboard / PDF
//     csv: string | null,       // CSV text for the CSV download
//   }

import { rowsToCsv } from './csv';

export function buildShareContent({
  title,
  narrative,
  sourceQuery,
  columns,
  rows,
}) {
  let csv = null;
  const hasTable = columns && rows && rows.length > 0;
  if (hasTable) {
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
    narrative: narrative || null,
    sourceQuery: sourceQuery || null,
    columns: hasTable ? columns : null,
    rows: hasTable ? rows : null,
    text: [title, narrative].filter(Boolean).join('\n\n'),
    csv,
  };
}

// Flatten a catalog body (bars / donut / stacked / waterfall / bubbles /
// metrics / kv / list / ring) into a rows-and-columns representation so
// the evidence view can always show a single, consistent data table.
function bodyToStructured(body) {
  if (!body) return { columns: null, rows: null };
  switch (body.type) {
    case 'table':
      return { columns: body.columns, rows: body.rows };
    case 'bars':
    case 'donut':
    case 'stacked':
    case 'waterfall':
      return {
        columns: [
          { header: 'Label', key: 'label' },
          { header: 'Value', key: 'value' },
        ],
        rows: body.data || [],
      };
    case 'bubbles':
      return {
        columns: [
          { header: 'Label', key: 'label' },
          { header: 'X', key: 'x' },
          { header: 'Y', key: 'y' },
          { header: 'Size', key: 'size' },
          { header: 'Priority', key: 'priority' },
        ],
        rows: body.data || [],
      };
    case 'metrics':
      return {
        columns: [
          { header: 'Label', key: 'label' },
          { header: 'Value', key: 'value' },
          { header: 'Note', key: 'sub' },
        ],
        rows: body.items || [],
      };
    case 'kv':
      return {
        columns: [
          { header: 'Label', key: 'label' },
          { header: 'Value', key: 'value' },
        ],
        rows: body.items || [],
      };
    case 'list':
      return {
        columns: [
          { header: 'Key', key: 'left' },
          { header: 'Description', key: 'right' },
          { header: 'Note', key: 'sub' },
        ],
        rows: body.items || [],
      };
    case 'ring':
      return {
        columns: [
          { header: 'Metric', key: 'metric' },
          { header: 'Value', key: 'value' },
          { header: 'Max', key: 'max' },
        ],
        rows: [
          {
            metric: body.label || 'Value',
            value: body.value,
            max: body.max || 100,
          },
        ],
      };
    default:
      return { columns: null, rows: null };
  }
}

// Compose a source query for a catalog entry. If the entry provides an
// explicit `query` field, use it. Otherwise, synthesize a plausible
// pseudo-SQL from the title + any table columns.
function deriveSourceQuery(entry) {
  if (entry?.query) return entry.query;
  if (!entry) return null;
  const title = entry.title || 'result';
  const body = entry.body;
  if (body?.type === 'table' && Array.isArray(body.columns)) {
    const cols = body.columns
      .map((c) => c.key || c.header?.toLowerCase().replace(/[^a-z0-9]+/g, '_'))
      .filter(Boolean)
      .slice(0, 6)
      .join(', ');
    return `-- "${title}"\nSELECT ${cols || '*'}\nFROM ${entry.source || 'dataset'};`;
  }
  return `-- "${title}"\nQUERY: ${title.toLowerCase()};`;
}

export function shareContentFromCatalogEntry(entry) {
  if (!entry) return null;
  const title = entry.title || 'Card';
  const narrative = entry.narrative || '';
  const sourceQuery = deriveSourceQuery(entry);
  const { columns, rows } = bodyToStructured(entry.body);

  let csv = null;
  if (columns && rows && rows.length > 0) {
    const headers = columns.map((c) => c.header);
    const values = rows.map((r) =>
      columns.map((c) => (c.key ? r[c.key] : ''))
    );
    csv = rowsToCsv(headers, values);
  }

  const text = [
    title,
    entry.source ? `Source: ${entry.source}` : null,
    narrative,
  ]
    .filter(Boolean)
    .join('\n\n');

  return {
    title,
    narrative: narrative || null,
    sourceQuery,
    columns,
    rows,
    text,
    csv,
  };
}
