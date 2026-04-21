import ResponseCard from './ResponseCard';
import DataTable from '../../ui/DataTable';
import InvestorLink from '../../artifacts/InvestorLink';
import { OWNERSHIP_CHANGES } from '../../../data/ownershipChanges';
import { flagFor } from '../../../utils/countryFlags';
import { formatSignedInt, formatSignedPct } from '../../../utils/formatters';
import { buildShareContent } from '../../../utils/shareContent';

const SHARE = buildShareContent({
  title: 'Ownership Changes — Last 30 Days',
  narrative:
    'Net buying activity has been moderate over the past 30 days, with 12 owners increasing positions and 8 decreasing. The largest single move was Nordea Investment Funds adding 45,000 shares.',
  columns: [
    { header: 'Owner', key: 'name' },
    { header: 'Country', key: 'country' },
    { header: 'Delta Shares', key: 'deltaShares' },
    { header: 'Delta Capital %', key: 'deltaCapital' },
    { header: 'Direction', key: 'direction' },
  ],
  rows: OWNERSHIP_CHANGES,
});

export default function OwnershipChangesCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  const columns = [
    {
      header: 'Owner',
      key: 'name',
      render: (r) => <InvestorLink name={r.name} />,
    },
    {
      header: 'Country',
      key: 'country',
      align: 'center',
      render: (r) => (
        <span style={{ fontSize: '13px' }} title={r.country}>
          {flagFor(r.country)}
        </span>
      ),
    },
    {
      header: 'Δ Shares',
      align: 'right',
      nowrap: true,
      render: (r) => formatSignedInt(r.deltaShares),
    },
    {
      header: 'Δ Capital',
      align: 'right',
      nowrap: true,
      render: (r) => formatSignedPct(r.deltaCapital),
    },
    {
      header: 'Dir',
      align: 'center',
      render: (r) =>
        r.direction === 'increase' ? (
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>▲</span>
        ) : (
          <span style={{ color: 'var(--text-tertiary)' }}>▼</span>
        ),
    },
  ];

  return (
    <ResponseCard
      title="Ownership Changes — Last 30 Days"
      followUps={[
        { id: 'l2.buyers.full-list', label: 'View full owner list' },
        { id: 'l2.buyers.last-quarter', label: 'Compare to last quarter' },
        { id: 'l2.buyers.foreign', label: 'Show foreign buyers only' },
      ]}
      expansionChips={[
        [
          { id: 'exp.buyers.coordinated', label: 'Detect coordinated buying' },
          { id: 'exp.buyers.stealth', label: 'Surface stealth accumulators' },
          { id: 'exp.buyers.predict', label: 'Predict next-week movers' },
        ],
        [
          { id: 'exp.buyers.conviction', label: 'Score buyer conviction' },
          { id: 'exp.buyers.peeroverlap', label: 'Map peer portfolio overlap' },
          { id: 'exp.buyers.outreach', label: 'Auto-draft outreach to top buyer' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for ownership flow — predictive models ship with production."
      mockToast="In production, this would run a flow-clustering model on the live tape."
      sourceModule="Shareholders → Owner Changes"
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
          lineHeight: 1.6,
          margin: '0 0 14px',
          letterSpacing: '-0.01em',
        }}
      >
        Net buying activity has been moderate over the past 30 days, with 12 owners increasing
        positions and 8 decreasing. The largest single move was Nordea Investment Funds adding
        45,000 shares.
      </p>
      <DataTable columns={columns} rows={OWNERSHIP_CHANGES} />
    </ResponseCard>
  );
}
