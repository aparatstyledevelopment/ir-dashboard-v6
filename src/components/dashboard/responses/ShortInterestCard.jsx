import ResponseCard from './ResponseCard';

export default function ShortInterestCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
}) {
  return (
    <ResponseCard
      title="Short Interest Overview"
      followUps={[
        { id: 'l2.short.holders', label: 'Show short holders' },
        { id: 'l2.short.vs-price', label: 'Short vs stock price' },
        { id: 'l2.short.peers', label: 'Peer short comparison' },
      ]}
      expansionChips={[
        [
          { id: 'exp.short.squeeze', label: 'Squeeze-risk forecast' },
          { id: 'exp.short.closers', label: 'Identify likely short closers' },
          { id: 'exp.short.rotation', label: 'Sector short rotation signals' },
        ],
        [
          { id: 'exp.short.borrow', label: 'Estimate borrow-cost trajectory' },
          { id: 'exp.short.ladder', label: 'Detect short ladder build-up' },
          { id: 'exp.short.narrative', label: 'Auto-draft anti-short narrative' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for short interest — squeeze risk modelling ships with production."
      mockToast="In production, this would join borrow data, options flow, and short tape."
      sourceModule="Short → Short Analysis"
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
        Short interest in INTEG B currently stands at 2.1% of capital, down from 2.8% three
        months ago. One disclosed short holder remains on the register: Marshall Wace LLP with a
        0.62% position, unchanged since February. Securities lending activity has been stable
        with no unusual spikes in borrowing demand.
      </p>
    </ResponseCard>
  );
}
