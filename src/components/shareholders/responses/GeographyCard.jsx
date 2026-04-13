import ResponseCard from '../../dashboard/responses/ResponseCard';
import DonutChart from '../../ui/DonutChart';
import { COUNTRY_BREAKDOWN } from '../../../data/shareholderTrend';
import { formatPct } from '../../../utils/formatters';
import { flagFor } from '../../../utils/countryFlags';
import { buildShareContent } from '../../../utils/shareContent';

const SHARE = buildShareContent({
  title: 'Holders by Country',
  narrative:
    'Sweden dominates at 68.4% of capital. Norway is the second-largest country at 21.7%, almost entirely from one strategic holder (Aviva Perfusion).',
  columns: [
    { header: 'Country', key: 'label' },
    { header: 'Code', key: 'country' },
    { header: 'Capital %', key: 'capitalPct' },
    { header: 'Owners', key: 'ownerCount' },
  ],
  rows: COUNTRY_BREAKDOWN,
});

export default function GeographyCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  const data = COUNTRY_BREAKDOWN.map((c) => ({
    key: c.country,
    label: `${flagFor(c.country) || '·'}  ${c.label}`,
    value: c.capitalPct,
  }));

  return (
    <ResponseCard
      title="Holders by Country"
      followUps={[
        { id: 'l2.sh.geo.europe', label: 'European holders' },
        { id: 'l2.sh.geo.americas', label: 'Americas holders' },
        { id: 'l2.sh.geo.asia', label: 'Asia & MENA holders' },
      ]}
      expansionChips={[
        [
          { id: 'exp.sh.geo.untapped', label: 'Identify untapped regions' },
          { id: 'exp.sh.geo.flows', label: 'Predict regional flows' },
          { id: 'exp.sh.geo.index', label: 'Find passive index inclusion candidates' },
        ],
        [
          { id: 'exp.sh.geo.fx', label: 'Estimate FX exposure of register' },
          { id: 'exp.sh.geo.regulation', label: 'Map regulatory disclosure thresholds' },
          { id: 'exp.sh.geo.travel', label: 'Plan travel itinerary by holder cluster' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for geography — global targeting ships with production."
      mockToast="In production, this would join your register with regional fund flow data."
      sourceModule="Shareholders → Owner Distribution"
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
          margin: '0 0 16px',
          letterSpacing: '-0.01em',
        }}
      >
        <span className="cb-strong">Sweden</span> dominates at{' '}
        <span className="cb-num">68.4%</span> of capital.{' '}
        <span className="cb-strong">Norway</span> is the second-largest country
        at <span className="cb-num">21.7%</span>, almost entirely from one
        strategic holder (Aviva Perfusion).
      </p>
      <DonutChart
        data={data}
        centerValue="8"
        centerLabel="Countries"
        valueFormatter={formatPct}
      />
    </ResponseCard>
  );
}
