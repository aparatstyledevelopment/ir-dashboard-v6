import ResponseCard from './ResponseCard';

export default function GenericResponseCard({
  query,
  attachments,
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  const hasAttachments = attachments && attachments.length > 0;
  const titleQuery = query || (hasAttachments ? '(card discussion)' : '');

  return (
    <ResponseCard
      title={`Query: ${titleQuery}`}
      followUps={[]}
      onFollowUp={onFollowUp}
      onSourceOpen={onSourceOpen}
      onShowToast={onShowToast}
      isChipSpent={isChipSpent}
      onAttach={onAttach}
      isAttached={isAttached}
    >
      {hasAttachments && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '10px 12px',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
            }}
          >
            Referenced cards ({attachments.length})
          </div>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}
          >
            {attachments.map((a) => (
              <li
                key={a.id}
                style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '-0.01em',
                }}
              >
                · {a.title}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          margin: 0,
          letterSpacing: '-0.01em',
        }}
      >
        {hasAttachments
          ? `In the full Command Bar experience, I would synthesize the ${attachments.length} selected card${attachments.length === 1 ? '' : 's'} above and respond to your question with cross-card analysis. This capability is coming soon.`
          : 'I can help with that. In the full Command Bar experience, I would search across all modules to answer this question. This capability is coming soon.'}
      </p>
    </ResponseCard>
  );
}
