import { useState } from 'react';
import { Link } from 'react-router-dom';
import ResponseCard from './ResponseCard';
import DataTable from '../../ui/DataTable';
import Sparkline from '../../ui/Sparkline';
import { TOP_HOLDERS } from '../../../data/holders';
import { formatPct } from '../../../utils/formatters';
import { slugify } from '../../../utils/slug';

export default function TopHoldersCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
}) {
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
      render: (r) => (
        <Link to={`/investor/${slugify(r.name)}`} className="cb-link">
          {r.name}
        </Link>
      ),
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
        { id: 'l2.top25.distribution', label: 'Show owner distribution' },
        { id: 'l2.top25.institutional', label: 'Institutional holders only' },
        { id: 'l2.top25.new-entrants', label: "Who's new in top 25?" },
      ]}
      expansionChips={[
        [
          { id: 'exp.top25.lookalikes', label: 'Find lookalike holders globally' },
          { id: 'exp.top25.churn', label: 'Spot churning positions' },
          { id: 'exp.top25.forecast', label: "Forecast next quarter's top 10" },
        ],
        [
          { id: 'exp.top25.esg', label: 'Map ESG alignment scores' },
          { id: 'exp.top25.gaps', label: 'Detect engagement gaps' },
          { id: 'exp.top25.briefs', label: 'Auto-draft holder briefs' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for the top-25 view — holder DNA matching ships with production."
      mockToast="In production, this would match against a global pool of 40k+ institutional profiles."
      sourceModule="Shareholders → Owners"
      onFollowUp={onFollowUp}
      onSourceOpen={onSourceOpen}
      onShowToast={onShowToast}
      isChipSpent={isChipSpent}
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
