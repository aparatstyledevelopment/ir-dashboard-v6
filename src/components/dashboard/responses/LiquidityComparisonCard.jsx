import ResponseCard from './ResponseCard';
import BarChart from '../../ui/BarChart';
import { PEER_LIQUIDITY } from '../../../data/peerLiquidity';
import { formatCurrencyEUR } from '../../../utils/formatters';
import { buildShareContent } from '../../../utils/shareContent';

const SHARE = buildShareContent({
  title: 'Liquidity Analysis — INTEG B vs Peers',
  narrative:
    "INTEG B's average daily turnover of €18,400 ranks 4th among its 5-company peer group. Spread has widened 12 basis points month-over-month.",
  columns: [
    { header: 'Company', key: 'name' },
    { header: 'Ticker', key: 'ticker' },
    { header: 'Avg Daily Turnover (EUR)', key: 'avgDailyTurnoverEUR' },
    { header: 'Avg Trades / Day', key: 'avgTradesPerDay' },
    { header: 'VWAP', key: 'vwap' },
    { header: 'Currency', key: 'currency' },
  ],
  rows: PEER_LIQUIDITY,
});

export default function LiquidityComparisonCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
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
      expansionChips={[
        [
          { id: 'exp.liq.forecast', label: 'Project liquidity for next quarter' },
          { id: 'exp.liq.windows', label: 'Recommend market-making windows' },
          { id: 'exp.liq.risk', label: 'Identify spread-risk hours' },
        ],
        [
          { id: 'exp.liq.buyback', label: 'Simulate buyback impact on liquidity' },
          { id: 'exp.liq.issuance', label: 'Compare to issuance scenarios' },
          { id: 'exp.liq.indexrebal', label: 'Detect index-rebalance risk' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for liquidity — intraday forecasting ships with production."
      mockToast="In production, this would run a microstructure model on the live order book."
      sourceModule="Liquidity → Liquidity Analysis"
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
