import ResponseCard from './ResponseCard';

export default function ShortInterestCard({ onFollowUp, onSourceOpen }) {
  return (
    <ResponseCard
      title="Short Interest Overview"
      followUps={['Show short holders', 'Short vs stock price', 'Peer short comparison']}
      sourceModule="Short → Short Analysis"
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
        Short interest in INTEG B currently stands at 2.1% of capital, down from 2.8% three
        months ago. One disclosed short holder remains on the register: Marshall Wace LLP with a
        0.62% position, unchanged since February. Securities lending activity has been stable
        with no unusual spikes in borrowing demand.
      </p>
    </ResponseCard>
  );
}
