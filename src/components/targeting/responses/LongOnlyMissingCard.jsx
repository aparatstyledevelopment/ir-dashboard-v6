import ResponseCard from '../../dashboard/responses/ResponseCard';
import DataTable from '../../ui/DataTable';
import { TARGETS } from '../../../data/targets';
import { flagFor } from '../../../utils/countryFlags';
import { buildShareContent } from '../../../utils/shareContent';

const LO_ROWS = TARGETS.filter(
  (t) => t.type === 'Fund' && t.priority !== 'Cold'
);

const SHARE = buildShareContent({
  title: 'Long-only Funds Missing EXMPL',
  narrative:
    'Long-only funds that are a strong fit and not currently holding EXMPL. Sorted by AI fit score.',
  columns: [
    { header: 'Fund', key: 'name' },
    { header: 'Manager', key: 'firm' },
    { header: 'Country', key: 'country' },
    { header: 'AUM', key: 'aum' },
    { header: 'Score', key: 'score' },
    { header: 'Priority', key: 'priority' },
  ],
  rows: LO_ROWS,
});

export default function LongOnlyMissingCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  const rows = TARGETS.filter(
    (t) => t.type === 'Fund' && t.priority !== 'Cold'
  ).slice(0, 8);

  const columns = [
    { header: 'Fund', key: 'name', weight: 500 },
    {
      header: 'Manager',
      key: 'firm',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{r.firm}</span>
      ),
    },
    {
      header: 'Country',
      key: 'country',
      align: 'center',
      render: (r) => <span style={{ fontSize: '13px' }}>{flagFor(r.country)}</span>,
    },
    {
      header: 'AUM',
      key: 'aum',
      nowrap: true,
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{r.aum}</span>
      ),
    },
    {
      header: 'Fit',
      key: 'score',
      align: 'right',
      weight: 600,
    },
  ];

  return (
    <ResponseCard
      title="Long-only Funds Missing EXMPL"
      followUps={[
        { id: 'l2.tgt.lo.esg', label: 'ESG-aligned only' },
        { id: 'l2.tgt.lo.nordic', label: 'Nordic mandates only' },
        { id: 'l2.tgt.lo.global', label: 'Global small-cap mandates' },
      ]}
      expansionChips={[
        [
          { id: 'exp.tgt.lo.cadence', label: 'Model typical entry cadence' },
          { id: 'exp.tgt.lo.sector', label: 'Sector concentration analysis' },
          { id: 'exp.tgt.lo.peers', label: 'Peer long-only holders' },
        ],
        [
          { id: 'exp.tgt.lo.mandate', label: 'Match to mandate criteria' },
          { id: 'exp.tgt.lo.sentiment', label: 'Score sell-side sentiment' },
          { id: 'exp.tgt.lo.outreach', label: 'Suggest outreach window' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for long-only targeting — full mandate-matching ships with production."
      mockToast="In production, this would join mandate filings with live fund flow data."
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
        <span className="cb-num">{rows.length}</span> long-only funds that are
        a strong fit and not currently holding EXMPL. Sorted by AI fit score.
      </p>
      <DataTable columns={columns} rows={rows} />
    </ResponseCard>
  );
}
