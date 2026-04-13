import ResponseCard from '../../dashboard/responses/ResponseCard';
import DonutChart from '../../ui/DonutChart';
import { TYPE_BREAKDOWN } from '../../../data/shareholderTrend';
import { formatPct } from '../../../utils/formatters';

export default function OwnerTypeCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  const data = TYPE_BREAKDOWN.map((t) => ({
    key: t.type,
    label: t.type,
    value: t.capitalPct,
    sub: `${t.ownerCount} owners`,
  }));

  return (
    <ResponseCard
      title="Holders by Type"
      followUps={[
        { id: 'l2.sh.type.funds', label: 'Fund holders detail' },
        { id: 'l2.sh.type.individuals', label: 'Individual holders detail' },
        { id: 'l2.sh.type.strategic', label: 'Strategic / Other holders' },
      ]}
      expansionChips={[
        [
          { id: 'exp.sh.type.aligned', label: 'Find aligned long-only funds' },
          { id: 'exp.sh.type.rotation', label: 'Detect type rotation' },
          { id: 'exp.sh.type.outreach', label: 'Suggest type-targeted outreach' },
        ],
        [
          { id: 'exp.sh.type.duration', label: 'Estimate average holding duration' },
          { id: 'exp.sh.type.style', label: 'Map by investment style' },
          { id: 'exp.sh.type.risk', label: 'Score type concentration risk' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for holder taxonomy — full taxonomy AI ships with production."
      mockToast="In production, this would join your register with global holder taxonomies."
      sourceModule="Shareholders → Owner Distribution"
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
          margin: '0 0 16px',
          letterSpacing: '-0.01em',
        }}
      >
        <span className="cb-strong">Individuals</span> (mainly the founder +
        retail) own <span className="cb-num">32.4%</span>.{' '}
        <span className="cb-strong">Funds</span> hold{' '}
        <span className="cb-num">25.8%</span>, strategic blocks{' '}
        <span className="cb-num">24.1%</span>, pension/insurance{' '}
        <span className="cb-num">11.6%</span>, banks{' '}
        <span className="cb-num">6.1%</span>.
      </p>
      <DonutChart
        data={data}
        centerValue="5"
        centerLabel="Types"
        valueFormatter={formatPct}
      />
    </ResponseCard>
  );
}
