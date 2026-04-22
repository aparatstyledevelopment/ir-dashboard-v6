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
  sourceDescription,
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
    sourceDescription: sourceDescription || null,
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
// pseudo-SQL from the title, body type, table columns, and source path.
function deriveSourceQuery(entry) {
  if (entry?.query) return entry.query;
  if (!entry) return null;
  const title = entry.title || 'result';
  const body = entry.body;
  const src = entry.source
    ? entry.source.replace(/\s*→\s*/g, '.').toLowerCase().replace(/\s+/g, '_')
    : 'dataset';

  if (body?.type === 'table' && Array.isArray(body.columns)) {
    const cols = body.columns
      .map((c) => c.key || c.header?.toLowerCase().replace(/[^a-z0-9_]+/g, '_'))
      .filter(Boolean)
      .slice(0, 6)
      .join(', ');
    const rowCount = Array.isArray(body.rows) ? body.rows.length : null;
    const where = body.mode?.includes('link')
      ? '\nWHERE visibility = \'disclosed\''
      : '';
    const limit = rowCount && rowCount >= 10 ? `\nLIMIT ${rowCount}` : '';
    return `-- ${title}\nSELECT ${cols || '*'}\nFROM ${src}${where}\nORDER BY 1 ASC${limit};`;
  }
  if (body?.type === 'bars' || body?.type === 'donut' || body?.type === 'stacked') {
    return `-- ${title}\nSELECT label, value\nFROM ${src}\nORDER BY value DESC;`;
  }
  if (body?.type === 'waterfall') {
    return `-- ${title}\nSELECT label, delta_value AS value\nFROM ${src}\nORDER BY sort_order ASC;`;
  }
  if (body?.type === 'bubbles') {
    return `-- ${title}\nSELECT label, x_axis AS x, y_axis AS y, size, priority\nFROM ${src}\nORDER BY size DESC;`;
  }
  if (body?.type === 'metrics' || body?.type === 'kv') {
    return `-- ${title}\nSELECT metric_label, metric_value\nFROM ${src}_metrics;`;
  }
  return `-- ${title}\nSELECT *\nFROM ${src};`;
}

function deriveSourceDescription(entry) {
  if (entry?.sourceDescription) return entry.sourceDescription;
  if (!entry) return null;
  const title = entry.title || '';
  const body = entry.body;
  const src = entry.source || '';
  const prefix = `Fetches ${title.toLowerCase()}`;
  if (body?.type === 'table') {
    const count = Array.isArray(body.rows) ? body.rows.length : 0;
    return `${prefix}. Returns ${count} row${count === 1 ? '' : 's'} from the ${src || 'dataset'} with columns for ${(body.columns || []).map((c) => c.header).join(', ')}.`;
  }
  if (body?.type === 'bars' || body?.type === 'donut' || body?.type === 'stacked') {
    return `${prefix}. Breaks down the data into labeled segments sorted by value, sourced from ${src || 'the dataset'}.`;
  }
  if (body?.type === 'waterfall') {
    return `${prefix}. Shows incremental changes (positive and negative) that sum to the net result, sourced from ${src || 'the dataset'}.`;
  }
  if (body?.type === 'bubbles') {
    return `${prefix}. Plots each item by two dimensions with size indicating magnitude, sourced from ${src || 'the dataset'}.`;
  }
  if (body?.type === 'metrics' || body?.type === 'kv') {
    return `${prefix}. Returns key summary metrics from ${src || 'the dataset'}.`;
  }
  return `${prefix} from ${src || 'the dataset'}.`;
}

export function shareContentFromCatalogEntry(entry) {
  if (!entry) return null;
  const title = entry.title || 'Card';
  const narrative = entry.narrative || '';
  const sourceQuery = deriveSourceQuery(entry);
  const sourceDescription = deriveSourceDescription(entry);
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
    sourceDescription,
    columns,
    rows,
    text,
    csv,
  };
}
