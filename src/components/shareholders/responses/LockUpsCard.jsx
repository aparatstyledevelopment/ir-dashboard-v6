import ResponseCard from '../../dashboard/responses/ResponseCard';
import DataTable from '../../ui/DataTable';
import InvestorLink from '../../artifacts/InvestorLink';
import { LOCKUPS } from '../../../data/lockups';
import {
  formatDateShort,
  formatNumber,
  formatPct,
} from '../../../utils/formatters';
import { buildShareContent } from '../../../utils/shareContent';

const SHARE = buildShareContent({
  title: 'Lock-up Agreements',
  narrative:
    '4.34M shares (14.15% of capital) are currently locked up across 3 active agreements. The next major expiry is the founder block of 4.20M shares on June 30, 2026.',
  columns: [
    { header: 'Person', key: 'person' },
    { header: 'Role', key: 'role' },
    { header: 'Shares', key: 'shares' },
    { header: 'Capital %', key: 'pctOfCapital' },
    { header: 'Expiry', key: 'expiryDate' },
    { header: 'Type', key: 'type' },
  ],
  rows: LOCKUPS,
});

export default function LockUpsCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  const columns = [
    {
      header: 'Person',
      key: 'person',
      render: (r) => <InvestorLink name={r.person} />,
    },
    {
      header: 'Role',
      key: 'role',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
          {r.role}
        </span>
      ),
    },
    {
      header: 'Shares',
      key: 'shares',
      align: 'right',
      nowrap: true,
      render: (r) => formatNumber(r.shares),
    },
    {
      header: 'Capital %',
      key: 'pctOfCapital',
      align: 'right',
      nowrap: true,
      weight: 500,
      render: (r) => formatPct(r.pctOfCapital),
    },
    {
      header: 'Expiry',
      key: 'expiryDate',
      nowrap: true,
      render: (r) => formatDateShort(r.expiryDate),
    },
  ];

  return (
    <ResponseCard
      title="Lock-up Agreements"
      followUps={[
        { id: 'l2.sh.lockup.timeline', label: 'Expiry timeline' },
        { id: 'l2.sh.lockup.persons', label: 'Locked-up insiders' },
        { id: 'l2.sh.lockup.history', label: 'Release history' },
      ]}
      expansionChips={[
        [
          { id: 'exp.sh.lock.impact', label: 'Model lock-up release impact' },
          { id: 'exp.sh.lock.renewal', label: 'Suggest renewal language' },
          { id: 'exp.sh.lock.peers', label: 'Compare to peer lock-up structures' },
        ],
        [
          { id: 'exp.sh.lock.absorb', label: 'Estimate market absorption capacity' },
          { id: 'exp.sh.lock.preann', label: 'Auto-draft pre-expiry announcement' },
          { id: 'exp.sh.lock.scenarios', label: 'Run release scenarios' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for lock-ups — release modelling ships with production."
      mockToast="In production, this would model market impact using historical comparable releases."
      sourceModule="Shareholders → Lock-ups"
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
        <span className="cb-num">4.34M</span> shares (
        <span className="cb-num">14.15%</span> of capital) are currently locked
        up across <span className="cb-num">3</span> active agreements. The next
        major expiry is the founder block of{' '}
        <span className="cb-num">4.20M</span> shares on{' '}
        <span className="cb-strong">June 30, 2026</span>.
      </p>
      <DataTable columns={columns} rows={LOCKUPS} />
    </ResponseCard>
  );
}
