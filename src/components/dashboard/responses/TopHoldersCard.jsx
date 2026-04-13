import { useState } from 'react';
import ResponseCard from './ResponseCard';
import DataTable from '../../ui/DataTable';
import Sparkline from '../../ui/Sparkline';
import { TOP_HOLDERS } from '../../../data/holders';
import { formatPct } from '../../../utils/formatters';

export default function TopHoldersCard({ onFollowUp, onSourceOpen }) {
  const [showAll, setShowAll] = useState(false);
  const rows = showAll ? TOP_HOLDERS : TOP_HOLDERS.slice(0, 10);

  const columns = [
    {
      header: '#',
      key: 'rank',
      align: 'right',
      nowrap: true,
      render: (r) => (
        <span style={{ color: 'var(--text-tertiary)' }}>{r.rank}</span>
      ),
    },
    {
      header: 'Owner',
      key: 'name',
      render: (r) => <span>{r.name}</span>,
    },
    {
      header: 'Capital %',
      align: 'right',
      nowrap: true,
      weight: 500,
      render: (r) => formatPct(r.capitalPct),
    },
    {
      header: 'Votes %',
      align: 'right',
      nowrap: true,
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)' }}>{formatPct(r.votesPct)}</span>
      ),
    },
    {
      header: 'Type',
      key: 'type',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{r.type}</span>
      ),
    },
    {
      header: 'Trend',
      align: 'center',
      render: (r) => (
        <span style={{ display: 'inline-flex' }}>
          <Sparkline trend={r.trend} />
        </span>
      ),
    },
  ];

  return (
    <ResponseCard
      title="Top 25 Shareholders by Capital %"
      followUps={[
        'Show owner distribution',
        'Institutional holders only',
        "Who's new in top 25?",
      ]}
      sourceModule="Shareholders → Owners"
      onFollowUp={onFollowUp}
      onSourceOpen={onSourceOpen}
    >
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: '0 0 14px',
          letterSpacing: '-0.01em',
        }}
      >
        The top 25 holders control 54.2% of capital. Concentration has decreased by 1.3
        percentage points since last quarter.
      </p>
      <DataTable columns={columns} rows={rows} />
      <button
        type="button"
        onClick={() => setShowAll((s) => !s)}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          marginTop: '12px',
          fontSize: '11px',
          color: 'var(--text-primary)',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          cursor: 'pointer',
          letterSpacing: '-0.01em',
        }}
      >
        {showAll ? 'Show top 10 ←' : 'Show all 25 →'}
      </button>
    </ResponseCard>
  );
}
