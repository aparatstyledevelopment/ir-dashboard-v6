import ResponseCard from './ResponseCard';

export default function GenericResponseCard({ query, onFollowUp, onSourceOpen }) {
  return (
    <ResponseCard
      title={`Query: ${query}`}
      followUps={['Back to overview', 'Try a different question']}
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
        I can help with that. In the full Command Bar experience, I would search across all
        modules to answer this question. This capability is coming soon.
      </p>
    </ResponseCard>
  );
}
