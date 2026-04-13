import ResponseCard from './ResponseCard';

export default function InsiderActivityCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
}) {
  return (
    <ResponseCard
      title="Insider & PDMR Activity"
      followUps={[
        { id: 'l2.insider.all-tx', label: 'Show all insider transactions' },
        { id: 'l2.insider.holdings', label: 'Board & management holdings' },
        { id: 'l2.insider.trend', label: 'Insider ownership trend' },
      ]}
      sourceModule="Insider → Transactions"
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
