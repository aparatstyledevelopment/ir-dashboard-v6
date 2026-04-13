import { Link } from 'react-router-dom';
import ResponseCard from '../../dashboard/responses/ResponseCard';
import DataTable from '../../ui/DataTable';
import Sparkline from '../../ui/Sparkline';
import { TOP_HOLDERS } from '../../../data/holders';
import { formatPct } from '../../../utils/formatters';
import { slugify } from '../../../utils/slug';

export default function RegisterCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  const rows = TOP_HOLDERS.slice(0, 10);

  const columns = [
    {
      header: '#',
      key: 'rank',
      align: 'right',
      nowrap: true,
      render: (r) => <span style={{ color: 'var(--text-tertiary)' }}>{r.rank}</span>,
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
      title="Shareholder Register"
      followUps={[
        { id: 'l2.sh.register.search', label: 'Search by name' },
        { id: 'l2.sh.register.export', label: 'Download CSV' },
        { id: 'l2.sh.register.history', label: 'Register history' },
      ]}
      expansionChips={[
        [
          { id: 'exp.sh.reg.engage', label: 'Suggest holders to engage this week' },
          { id: 'exp.sh.reg.new', label: 'Auto-detect new entrants' },
          { id: 'exp.sh.reg.sentiment', label: 'Sentiment of recent activity' },
        ],
        [
          { id: 'exp.sh.reg.bench', label: 'Benchmark against peer registers' },
          { id: 'exp.sh.reg.flags', label: 'Flag registered changes since last sync' },
          { id: 'exp.sh.reg.cluster', label: 'Cluster holders by behaviour' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for the register — register intelligence ships with production."
      mockToast="In production, this would query the live register sync and CRM for the freshest signal."
      sourceModule="Shareholders → Owners"
      onFollowUp={onFollowUp}
      onSourceOpen={onSourceOpen}
      onShowToast={onShowToast}
      isChipSpent={isChipSpent}
      onAttach={onAttach}
      isAttached={isAttached}
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
        <span className="cb-num">3,498</span> identified holders. The top{' '}
        <span className="cb-num">25</span> control{' '}
        <span className="cb-num">54.2%</span> of capital. The remaining{' '}
        <span className="cb-num">3,473</span> holders together own{' '}
        <span className="cb-num">45.8%</span>{' '}
        <span style={{ color: 'var(--text-tertiary)' }}>(~14.0M shares)</span>.
        Showing the top 10 below.
      </p>
      <DataTable columns={columns} rows={rows} />
    </ResponseCard>
  );
}
