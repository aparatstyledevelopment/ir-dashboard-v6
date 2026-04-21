import { ExternalLink } from 'lucide-react';
import { resolveShareFromMessage } from '../../../utils/resolveShare';
import DataTable from '../../ui/DataTable';

// Renders the source-data evidence for a given response card. We lean on
// the existing shareContent pipeline because it already provides a
// consistent {title, narrative, columns, rows, text, csv} view of every
// card in the system.
export default function CardEvidenceView({ message, sourceModule }) {
  const share = message ? resolveShareFromMessage(message) : null;
  const title = share?.title || 'Source data';

  const hasTable =
    share?.columns && share.rows && share.columns.length > 0 && share.rows.length > 0;

  const tableColumns = hasTable
    ? share.columns.map((c) => ({
        header: c.header || c.label || c.key,
        key: c.key,
        align: c.align,
        nowrap: c.nowrap,
        render: (row) => row[c.key],
      }))
    : [];

  return (
    <div className="cb-screen-inner cb-screen-inner--pane">
      <header className="cb-screen-header">
        <h1>{title}</h1>
        {sourceModule && (
          <p>
            Source: <strong style={{ color: 'var(--text-secondary)' }}>{sourceModule}</strong>
          </p>
        )}
      </header>

      {share?.narrative && (
        <p
          style={{
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            margin: '0 0 14px',
            letterSpacing: '-0.01em',
          }}
        >
          {share.narrative}
        </p>
      )}

      {hasTable ? (
        <div style={{ marginTop: '2px' }}>
          <DataTable columns={tableColumns} rows={share.rows} />
        </div>
      ) : share?.text ? (
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            background: 'var(--bar-track)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '12px 14px',
            margin: 0,
            letterSpacing: '-0.01em',
            lineHeight: 1.55,
          }}
        >
          {share.text}
        </pre>
      ) : (
        <div className="cb-screen-empty">
          No structured source data is available for this card.
        </div>
      )}

      {sourceModule && (
        <p
          style={{
            marginTop: '14px',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            letterSpacing: '-0.01em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ExternalLink size={11} strokeWidth={1.75} />
          In the full platform, this opens the {sourceModule} data view.
        </p>
      )}
    </div>
  );
}
