import ResponseCard from '../../dashboard/responses/ResponseCard';
import DataTable from '../../ui/DataTable';

// Mock data inline — holders that recently exited the register, with
// last-seen percentage and date.
const EXITS = [
  {
    name: 'Alliance Bernstein Intl Growth',
    country: 'US',
    lastSeen: '2025-12-18',
    lastPct: 0.31,
    reason: 'Rotation out of small-cap healthcare',
  },
  {
    name: 'Union Bancaire Privée',
    country: 'CH',
    lastSeen: '2025-10-04',
    lastPct: 0.24,
    reason: 'Mandate closure',
  },
  {
    name: 'BNP Paribas Smaller Europe',
    country: 'FR',
    lastSeen: '2025-08-22',
    lastPct: 0.18,
    reason: 'Sector underweight',
  },
  {
    name: 'Prudential International',
    country: 'GB',
    lastSeen: '2025-07-11',
    lastPct: 0.12,
    reason: 'PM change',
  },
];

export default function RecentExitsCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  const columns = [
    { header: 'Holder', key: 'name', weight: 500 },
    {
      header: 'Last seen',
      key: 'lastSeen',
      nowrap: true,
      render: (r) => (
        <span style={{ color: 'var(--text-tertiary)' }}>{r.lastSeen}</span>
      ),
    },
    {
      header: 'Last %',
      key: 'lastPct',
      align: 'right',
      weight: 500,
      render: (r) => `${r.lastPct}%`,
    },
    {
      header: 'Reason',
      key: 'reason',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{r.reason}</span>
      ),
    },
  ];

  return (
    <ResponseCard
      title="Recently Exited Holders"
      followUps={[
        { id: 'l2.tgt.exit.winback', label: 'Winback candidates' },
        { id: 'l2.tgt.exit.reason', label: 'Exit reason breakdown' },
        { id: 'l2.tgt.exit.sequence', label: 'Auto-draft winback sequence' },
      ]}
      expansionChips={[
        [
          { id: 'exp.tgt.exit.tenure', label: 'Average tenure before exit' },
          { id: 'exp.tgt.exit.signal', label: 'Early exit signal detection' },
          { id: 'exp.tgt.exit.peers', label: 'Did they rotate into peers?' },
        ],
        [
          { id: 'exp.tgt.exit.recover', label: 'Recovery probability model' },
          { id: 'exp.tgt.exit.playbook', label: 'Winback playbook generator' },
          { id: 'exp.tgt.exit.alerts', label: 'Set return-watch alerts' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for winback — full exit-analysis engine ships with production."
      mockToast="In production, this would track exits across our full 24-month register history."
      sourceModule="Targeting → Compare Owners"
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
        <span className="cb-num">4</span> institutional holders have exited the
        register in the past 12 months. Each is a potential winback candidate,
        especially if the exit reason was a PM change or mandate closure rather
        than a thesis change.
      </p>
      <DataTable columns={columns} rows={EXITS} />
    </ResponseCard>
  );
}
