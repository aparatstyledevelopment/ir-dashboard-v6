import ResponseCard from '../../dashboard/responses/ResponseCard';
import DataTable from '../../ui/DataTable';
import { TARGETS } from '../../../data/targets';
import { flagFor } from '../../../utils/countryFlags';
import { buildShareContent } from '../../../utils/shareContent';

const LOOKALIKE_ROWS = TARGETS.filter(
  (t) => t.peersHolding.length >= 1 && t.priority !== 'Cold'
).map((t) => ({
  ...t,
  peersJoined: t.peersHolding.join('; '),
}));

const SHARE = buildShareContent({
  title: 'Lookalike Holders',
  narrative:
    '6 candidates match our current holder DNA on at least 2 traits (peer overlap, type, style, geography).',
  columns: [
    { header: 'Name', key: 'name' },
    { header: 'Country', key: 'country' },
    { header: 'Shared peers', key: 'peersJoined' },
    { header: 'Score', key: 'score' },
    { header: 'Priority', key: 'priority' },
  ],
  rows: LOOKALIKE_ROWS,
});

export default function LookalikeCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  // Lookalikes are targets that share >=2 of our top-holder DNA traits.
  // For the mock we pick warm+hot with peer overlap.
  const rows = TARGETS.filter(
    (t) => t.peersHolding.length >= 1 && t.priority !== 'Cold'
  ).slice(0, 6);

  const columns = [
    { header: 'Target', key: 'name', weight: 500 },
    {
      header: 'Country',
      key: 'country',
      align: 'center',
      render: (r) => <span style={{ fontSize: '13px' }}>{flagFor(r.country)}</span>,
    },
    {
      header: 'Shared peers',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
          {r.peersHolding.join(', ') || '—'}
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
      title="Lookalike Holders — DNA Match"
      followUps={[
        { id: 'l2.tgt.look.criteria', label: 'Show matching criteria' },
        { id: 'l2.tgt.look.heatmap', label: 'Peer overlap heatmap' },
        { id: 'l2.tgt.look.esg', label: 'Filter by ESG alignment' },
      ]}
      expansionChips={[
        [
          { id: 'exp.tgt.look.cluster', label: 'Cluster by holding style' },
          { id: 'exp.tgt.look.duration', label: 'Average holding duration' },
          { id: 'exp.tgt.look.conviction', label: 'Find highest-conviction lookalikes' },
        ],
        [
          { id: 'exp.tgt.look.behaviour', label: 'Predict behaviour post-entry' },
          { id: 'exp.tgt.look.playbook', label: 'Suggest outreach playbook' },
          { id: 'exp.tgt.look.alerts', label: 'Set match alerts' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for lookalike matching — full DNA engine ships with production."
      mockToast="In production, this would score against a global fund DNA catalogue of 40k+ profiles."
      sourceModule="Targeting → Compare Owners"
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
        <span className="cb-num">6</span> candidates match our current holder
        DNA on at least 2 traits (peer overlap, type, style, geography).
      </p>
      <DataTable columns={columns} rows={rows} />
    </ResponseCard>
  );
}
