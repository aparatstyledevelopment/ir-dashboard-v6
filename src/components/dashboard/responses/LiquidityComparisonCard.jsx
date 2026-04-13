import ResponseCard from './ResponseCard';
import BarChart from '../../ui/BarChart';
import { PEER_LIQUIDITY } from '../../../data/peerLiquidity';
import { formatCurrencyEUR } from '../../../utils/formatters';

export default function LiquidityComparisonCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
}) {
  const data = PEER_LIQUIDITY.map((p) => ({
    key: p.ticker,
    label: `${p.name} (${p.ticker})`,
    value: p.avgDailyTurnoverEUR,
  }));

  return (
    <ResponseCard
      title="Liquidity Analysis — INTEG B vs Peers"
      followUps={[
        { id: 'l2.liquidity.spread', label: 'Show spread analysis' },
        { id: 'l2.liquidity.volume-trend', label: 'Monthly volume trend' },
        { id: 'l2.liquidity.block-trades', label: 'Block trades this quarter' },
      ]}
      sourceModule="Liquidity → Liquidity Analysis"
      onFollowUp={onFollowUp}
      onSourceOpen={onSourceOpen}
      onShowToast={onShowToast}
      isChipSpent={isChipSpent}
    >
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: '0 0 16px',
          letterSpacing: '-0.01em',
        }}
      >
        INTEG B's average daily turnover of €18,400 ranks 4th among its 5-company peer group.
        Spread has widened 12 basis points month-over-month.
      </p>
      <BarChart data={data} highlightKey="INTEG B" valueFormatter={formatCurrencyEUR} />
      <div
        className="tabular"
        style={{
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border)',
          fontSize: '11px',
          color: 'var(--text-tertiary)',
          letterSpacing: '-0.01em',
        }}
      >
        Avg trades/day: 24 · VWAP: 15.89 SEK · Float: 69.94%
      </div>
    </ResponseCard>
  );
}
