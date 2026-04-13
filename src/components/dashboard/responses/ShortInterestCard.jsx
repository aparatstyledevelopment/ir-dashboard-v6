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
