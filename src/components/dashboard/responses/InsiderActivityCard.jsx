import ResponseCard from './ResponseCard';

export default function InsiderActivityCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  return (
    <ResponseCard
      title="Insider & PDMR Activity"
      followUps={[
        { id: 'l2.insider.all-tx', label: 'Show all insider transactions' },
        { id: 'l2.insider.holdings', label: 'Board & management holdings' },
        { id: 'l2.insider.trend', label: 'Insider ownership trend' },
      ]}
      expansionChips={[
        [
          { id: 'exp.ins.predict', label: 'Predict next insider trade' },
          { id: 'exp.ins.options', label: 'Cross-reference with options activity' },
          { id: 'exp.ins.minutes', label: 'Sentiment from board minutes' },
        ],
        [
          { id: 'exp.ins.vesting', label: 'Estimate vesting cliff impact' },
          { id: 'exp.ins.conviction', label: 'Map insider conviction over time' },
          { id: 'exp.ins.boardbrief', label: 'Auto-draft board briefing' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for insider activity — intent inference ships with production."
      mockToast="In production, this would join PDMR filings with options flow and meeting minutes."
      sourceModule="Insider → Transactions"
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
          lineHeight: 1.6,
          margin: 0,
          letterSpacing: '-0.01em',
        }}
      >
        No new PDMR transactions have been reported for Integrum in the past 14 days. The most
        recent filing was on March 28, when board member Erik Lundström acquired 2,500 shares at
        15.20 SEK through a market purchase. Total insider ownership stands at 23.19% of capital,
        dominated by Richard Brännemark's 23.19% stake.
      </p>
    </ResponseCard>
  );
}
