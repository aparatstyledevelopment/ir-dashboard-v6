import ResponseCard from '../../dashboard/responses/ResponseCard';
import DataTable from '../../ui/DataTable';
import { PEER_GAPS } from '../../../data/targets';
import { flagFor } from '../../../utils/countryFlags';
import { formatPct } from '../../../utils/formatters';

export default function PeerGapsCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  const columns = [
    {
      header: 'Peer',
      key: 'peer',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
          {r.peer}
        </span>
      ),
    },
    { header: 'Holder', key: 'holder', weight: 500 },
    {
      header: 'Country',
      key: 'country',
      align: 'center',
      render: (r) => <span style={{ fontSize: '13px' }}>{flagFor(r.country)}</span>,
    },
    {
      header: 'Holds peer',
      align: 'right',
      nowrap: true,
      render: (r) => formatPct(r.holdingPct),
    },
    {
      header: 'Us',
      render: () => (
        <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>
          Not holding
        </span>
      ),
    },
  ];

  return (
    <ResponseCard
      title="Peer Holders — Gap Analysis"
      followUps={[
        { id: 'l2.tgt.gap.byPeer', label: 'Group by peer' },
        { id: 'l2.tgt.gap.multi', label: 'Holders of 2+ peers' },
        { id: 'l2.tgt.gap.contact', label: 'Start outreach list' },
      ]}
      expansionChips={[
        [
          { id: 'exp.tgt.gap.reason', label: 'Why do they hold peers, not us?' },
          { id: 'exp.tgt.gap.pitch', label: 'Auto-draft "join the club" pitch' },
          { id: 'exp.tgt.gap.proxy', label: 'Find proxy meetings via sell-side' },
        ],
        [
          { id: 'exp.tgt.gap.winback', label: 'Model win-back probability' },
          { id: 'exp.tgt.gap.cluster', label: 'Cluster gaps by investor style' },
          { id: 'exp.tgt.gap.outreach', label: 'Generate multi-touch sequence' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for peer gap closing — full engagement modelling ships with production."
      mockToast="In production, this would cross-reference peer register diffs with our CRM history."
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
        <span className="cb-num">47</span> institutional holders own at least
        one of our 5 closest peers but not INTEG B.{' '}
        <span className="cb-num">18</span> of them hold{' '}
        <span className="cb-strong">2 or more peers</span> — highest-conversion
        candidates for peer-gap outreach. Showing top 5 below.
      </p>
      <DataTable columns={columns} rows={PEER_GAPS} />
    </ResponseCard>
  );
}
