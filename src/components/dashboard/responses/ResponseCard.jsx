import ChipGroup from '../../ui/ChipGroup';
import SourceDataLink from '../../shared/SourceDataLink';

export default function ResponseCard({
  title,
  children,
  followUps = [],
  expansionChips,
  sourceModule,
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
}) {
  // Normalize legacy string follow-ups to {id, label} objects.
  const normalized = followUps.map((f, i) =>
    typeof f === 'string' ? { id: `${title}-fu-${i}`, label: f } : f
  );

  return (
    <article
      className="fade-in-up cb-card"
      style={{ borderRadius: '4px' }}
    >
      <header
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </header>
      <div style={{ padding: '14px 16px' }}>{children}</div>
      {normalized.length > 0 && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <ChipGroup
            chips={normalized}
            expansionChips={expansionChips}
            onChipClick={onFollowUp}
            onShowToast={onShowToast}
            isChipSpent={isChipSpent}
          />
        </div>
      )}
      {sourceModule && (
        <div style={{ padding: '0 16px 14px' }}>
          <SourceDataLink module={sourceModule} onOpen={onSourceOpen} />
        </div>
      )}
    </article>
  );
}
