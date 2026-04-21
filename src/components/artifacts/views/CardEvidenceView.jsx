import { Database, Code2 } from 'lucide-react';
import { resolveShareFromMessage } from '../../../utils/resolveShare';
import DataTable from '../../ui/DataTable';

function cellValue(row, col) {
  if (col.key) return row[col.key];
  if (typeof col.value === 'function') return col.value(row);
  return '';
}

function renderCell(row, col) {
  const raw = cellValue(row, col);
  if (typeof col.format === 'function') {
    return col.format(raw, row);
  }
  if (raw === null || raw === undefined) return '';
  return raw;
}

// Evidence view for any response card: shows the (pseudo-)query that
// produced the data and the raw table the card was derived from.
export default function CardEvidenceView({ message, sourceModule }) {
  const share = message ? resolveShareFromMessage(message) : null;
  const title = share?.title || 'Source data';

  const hasTable = share?.columns && share?.rows && share.rows.length > 0;

  const tableColumns = hasTable
    ? share.columns.map((c) => ({
        header: c.header || c.label || c.key,
        key: c.key,
        align: c.align,
        nowrap: c.nowrap,
        render: (row) => renderCell(row, c),
      }))
    : [];

  return (
    <div className="cb-screen-inner cb-screen-inner--pane">
      <header className="cb-screen-header">
        <h1>{title}</h1>
        {sourceModule && (
          <p>
            Source data view · <strong style={{ color: 'var(--text-secondary)' }}>{sourceModule}</strong>
          </p>
        )}
      </header>

      {share?.narrative && (
        <p
          style={{
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            margin: '0 0 12px',
            letterSpacing: '-0.01em',
          }}
        >
          {share.narrative}
        </p>
      )}

      {share?.sourceQuery && (
        <section className="cb-evidence-section">
          <div className="cb-evidence-section-head">
            <Code2 size={12} strokeWidth={1.75} />
            <span>Query</span>
          </div>
          <pre className="cb-evidence-query">{share.sourceQuery}</pre>
        </section>
      )}

      <section className="cb-evidence-section">
        <div className="cb-evidence-section-head">
          <Database size={12} strokeWidth={1.75} />
          <span>Response</span>
          {hasTable && (
            <span className="cb-evidence-section-count">
              {share.rows.length} row{share.rows.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
        {hasTable ? (
          <DataTable columns={tableColumns} rows={share.rows} />
        ) : share?.text ? (
          <pre className="cb-evidence-query">{share.text}</pre>
        ) : (
          <div className="cb-screen-empty">
            No structured source data is available for this card.
          </div>
        )}
      </section>
    </div>
  );
}
