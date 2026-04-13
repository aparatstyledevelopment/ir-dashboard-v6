import ResponseCard from '../../dashboard/responses/ResponseCard';
import Sparkline from '../../ui/Sparkline';
import { OWNER_TREND_12M } from '../../../data/shareholderTrend';
import { formatNumber } from '../../../utils/formatters';
import { buildShareContent } from '../../../utils/shareContent';

const TREND_ROWS = OWNER_TREND_12M.months.map((m, i) => ({
  month: m,
  ownerCount: OWNER_TREND_12M.ownerCount[i],
  freeFloat: OWNER_TREND_12M.freeFloat[i],
  foreign: OWNER_TREND_12M.foreign[i],
}));

const SHARE = buildShareContent({
  title: 'Owner Count — Trailing 12 Months',
  narrative:
    'Owner count has grown from 3,374 to 3,498 (+124, +3.7%) over the past 12 months. Net additions accelerated in Q1 2026.',
  columns: [
    { header: 'Month', key: 'month' },
    { header: 'Owners', key: 'ownerCount' },
    { header: 'Free Float %', key: 'freeFloat' },
    { header: 'Foreign %', key: 'foreign' },
  ],
  rows: TREND_ROWS,
});

export default function OwnerTrendCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  const start = OWNER_TREND_12M.ownerCount[0];
  const end =
    OWNER_TREND_12M.ownerCount[OWNER_TREND_12M.ownerCount.length - 1];
  const delta = end - start;
  const deltaPct = (delta / start) * 100;

  return (
    <ResponseCard
      title="Owner Count — Trailing 12 Months"
      followUps={[
        { id: 'l2.sh.trend.composition', label: 'Composition trend by type' },
        { id: 'l2.sh.trend.foreign', label: 'Foreign ownership trend' },
        { id: 'l2.sh.trend.concentration', label: 'Top-25 concentration trend' },
      ]}
      expansionChips={[
        [
          { id: 'exp.sh.trend.forecast', label: 'Forecast next 6 months' },
          { id: 'exp.sh.trend.inflection', label: 'Detect inflection points' },
          { id: 'exp.sh.trend.peers', label: 'Compare to peer trends' },
        ],
        [
          { id: 'exp.sh.trend.attribution', label: 'Attribute growth by holder type' },
          { id: 'exp.sh.trend.scenarios', label: 'Run register growth scenarios' },
          { id: 'exp.sh.trend.alerts', label: 'Set growth alerts' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for register trend — forecasting ships with production."
      mockToast="In production, this would project growth from CRM signals + filing flow."
      sourceModule="Shareholders → Owner Trend"
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
        Owner count has grown from{' '}
        <span className="cb-num">{formatNumber(start)}</span> to{' '}
        <span className="cb-num">{formatNumber(end)}</span>{' '}
        <span className="cb-pos">
          (+{delta} owners, +{deltaPct.toFixed(1)}%)
        </span>{' '}
        over the past 12 months. Net additions accelerated in Q1 2026.
      </p>

      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '14px 14px 10px',
        }}
      >
        <Sparkline
          data={OWNER_TREND_12M.ownerCount}
          width="100%"
          viewWidth={640}
          height={68}
          strokeWidth={1.75}
          color="var(--text-primary)"
          fill
        />
        <div
          className="tabular"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            marginTop: '6px',
            letterSpacing: '-0.01em',
          }}
        >
          {OWNER_TREND_12M.months.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>
    </ResponseCard>
  );
}
