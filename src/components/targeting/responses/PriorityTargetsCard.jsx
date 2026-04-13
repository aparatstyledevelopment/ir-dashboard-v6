import ResponseCard from '../../dashboard/responses/ResponseCard';
import DataTable from '../../ui/DataTable';
import { TARGETS } from '../../../data/targets';
import { flagFor } from '../../../utils/countryFlags';
import { buildShareContent } from '../../../utils/shareContent';

const SHARE = buildShareContent({
  title: 'Prioritized Targets',
  narrative:
    'Top 8 AI-prioritized targets. Polar Capital Healthcare leads with a 92/100 fit score — already holds 3 of our 5 closest peers.',
  columns: [
    { header: 'Name', key: 'name' },
    { header: 'Firm', key: 'firm' },
    { header: 'Type', key: 'type' },
    { header: 'Country', key: 'country' },
    { header: 'AUM', key: 'aum' },
    { header: 'Priority', key: 'priority' },
    { header: 'Score', key: 'score' },
    { header: 'Rationale', key: 'rationale' },
  ],
  rows: TARGETS,
});

const PRIORITY_COLOR = {
  Hot: 'var(--negative)',
  Warm: 'var(--text-primary)',
  Cold: 'var(--text-tertiary)',
};

export default function PriorityTargetsCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  const rows = TARGETS.slice(0, 8);

  const columns = [
    {
      header: '#',
      align: 'right',
      nowrap: true,
      render: (_r, i) => (
        <span style={{ color: 'var(--text-tertiary)' }}>{i + 1}</span>
      ),
    },
    { header: 'Target', key: 'name', weight: 500 },
    {
      header: 'Country',
      key: 'country',
      align: 'center',
      render: (r) => <span style={{ fontSize: '13px' }}>{flagFor(r.country)}</span>,
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (r) => (
        <span
          style={{
            color: PRIORITY_COLOR[r.priority],
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          ● {r.priority}
        </span>
      ),
    },
    {
      header: 'Score',
      key: 'score',
      align: 'right',
      weight: 600,
      render: (r) => r.score,
    },
  ];

  return (
    <ResponseCard
      title="Prioritized Targets — Top 8"
      followUps={[
        { id: 'l2.tgt.priority.hot', label: 'Hot targets only' },
        { id: 'l2.tgt.priority.details', label: 'Score breakdown' },
        { id: 'l2.tgt.priority.outreach', label: 'Draft outreach sequence' },
      ]}
      expansionChips={[
        [
          { id: 'exp.tgt.pr.rank', label: 'Re-rank by 12-month fit projection' },
          { id: 'exp.tgt.pr.prob', label: 'Estimate probability of engagement' },
          { id: 'exp.tgt.pr.channel', label: 'Suggest best contact channel' },
        ],
        [
          { id: 'exp.tgt.pr.heat', label: 'Map target heat over time' },
          { id: 'exp.tgt.pr.conv', label: 'Simulate conversion scenarios' },
          { id: 'exp.tgt.pr.brief', label: 'Auto-draft 1-pager per target' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for prioritized targets — continuous re-ranking ships with production."
      mockToast="In production, this would run the live scoring model over today's filings."
      sourceModule="Targeting → Screener"
      onFollowUp={onFollowUp}
      onSourceOpen={onSourceOpen}
      onShowToast={onShowToast}
      isChipSpent={isChipSpent}
      onAttach={onAttach}
      isAttached={isAttached}
      shareContent={SHARE}
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
        Top <span className="cb-num">8</span> AI-prioritized targets. The
        highest-scoring target this week is{' '}
        <span className="cb-strong">Polar Capital Healthcare</span>{' '}
        (<span className="cb-num">92/100</span>) — already owns 3 of our 5
        closest peers.
      </p>
      <DataTable columns={columns} rows={rows} />
    </ResponseCard>
  );
}
