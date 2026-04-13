import { Link } from 'react-router-dom';
import ResponseCard from './ResponseCard';
import DataTable from '../../ui/DataTable';
import BarChart from '../../ui/BarChart';
import { getCatalogEntry } from '../../../data/responseCatalog';
import { flagFor } from '../../../utils/countryFlags';
import { slugify } from '../../../utils/slug';
import {
  formatPct,
  formatSignedInt,
  formatSignedPct,
  formatCurrencyEUR,
  formatNumber,
  formatDateShort,
} from '../../../utils/formatters';

function fmt(value, kind) {
  switch (kind) {
    case 'pct':
      return formatPct(value);
    case 'signedInt':
      return formatSignedInt(value);
    case 'signedPct':
      return formatSignedPct(value);
    case 'date':
      return formatDateShort(value);
    case 'eur':
      return formatCurrencyEUR(value);
    case 'int':
      return formatNumber(value);
    default:
      return value;
  }
}

function buildColumns(specCols, mode) {
  return specCols.map((col) => {
    let render;
    if (col.key === 'name' && mode && mode.endsWith('with-link')) {
      render = (r) => (
        <Link to={`/investor/${slugify(r.name)}`} className="cb-link">
          {r.name}
        </Link>
      );
    } else if (col.key === 'country') {
      render = (r) => (
        <span style={{ fontSize: '13px' }} title={r.country}>
          {flagFor(r.country)}
        </span>
      );
    } else if (col.fmt) {
      render = (r) => fmt(r[col.key], col.fmt);
    }
    return {
      header: col.header,
      key: col.key,
      align: col.align || 'left',
      nowrap: col.nowrap,
      weight: col.weight,
      render,
    };
  });
}

function StatBlock({ label, value, sub }) {
  return (
    <div className="cb-stat">
      <div className="cb-stat-label">{label}</div>
      <div className="cb-stat-value">{value}</div>
      {sub && <div className="cb-stat-sub">{sub}</div>}
    </div>
  );
}

function Body({ body }) {
  if (!body || body.type === 'narrative') return null;

  if (body.type === 'table') {
    const columns = buildColumns(body.columns, body.mode);
    return <DataTable columns={columns} rows={body.rows} />;
  }

  if (body.type === 'bars') {
    const formatter =
      body.valueFormatter === 'pct'
        ? formatPct
        : body.valueFormatter === 'eur'
        ? formatCurrencyEUR
        : (v) => v;
    return (
      <BarChart
        data={body.data}
        highlightKey={body.highlightKey}
        valueFormatter={formatter}
      />
    );
  }

  if (body.type === 'metrics') {
    return (
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {body.items.map((m, i) => (
          <StatBlock key={i} label={m.label} value={m.value} sub={m.sub} />
        ))}
      </div>
    );
  }

  if (body.type === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {body.items.map((it, i) => (
          <div
            key={i}
            className="tabular"
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '14px',
              padding: '10px 0',
              borderBottom:
                i === body.items.length - 1 ? 'none' : '1px solid var(--border)',
              fontSize: '12px',
              letterSpacing: '-0.01em',
            }}
          >
            <span
              style={{
                width: '90px',
                flexShrink: 0,
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}
            >
              {it.left}
            </span>
            <span style={{ flex: 1, color: 'var(--text-secondary)' }}>
              {it.right}
              {it.sub && (
                <span
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    color: 'var(--text-tertiary)',
                    marginTop: '2px',
                  }}
                >
                  {it.sub}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (body.type === 'kv') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {body.items.map((it, i) => (
          <div
            key={i}
            className="tabular"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '14px',
              padding: '9px 0',
              borderBottom:
                i === body.items.length - 1 ? 'none' : '1px solid var(--border)',
              fontSize: '12px',
              letterSpacing: '-0.01em',
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>{it.label}</span>
            <span
              style={{
                color: 'var(--text-primary)',
                fontWeight: 500,
              }}
            >
              {it.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default function DynamicResponseCard({
  catalogId,
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  const entry = getCatalogEntry(catalogId);
  if (!entry) return null;

  return (
    <ResponseCard
      title={entry.title}
      followUps={[]}
      onFollowUp={onFollowUp}
      onSourceOpen={onSourceOpen}
      onShowToast={onShowToast}
      isChipSpent={isChipSpent}
      onAttach={onAttach}
      isAttached={isAttached}
      sourceModule={entry.source}
    >
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          margin: '0 0 14px',
          letterSpacing: '-0.01em',
        }}
      >
        {entry.narrative}
      </p>
      <Body body={entry.body} />
    </ResponseCard>
  );
}
