import ResponseCard from './ResponseCard';

export default function InsiderActivityCard({ onFollowUp, onSourceOpen }) {
  return (
    <ResponseCard
      title="Insider & PDMR Activity"
      followUps={[
        'Show all insider transactions',
        'Board & management holdings',
        'Insider ownership trend',
      ]}
      sourceModule="Insider → Transactions"
      onFollowUp={onFollowUp}
      onSourceOpen={onSourceOpen}
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
