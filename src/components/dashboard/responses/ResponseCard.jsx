import Chip from '../../ui/Chip';
import SourceDataLink from '../../shared/SourceDataLink';

export default function ResponseCard({
  title,
  children,
  followUps = [],
  sourceModule,
  onFollowUp,
  onSourceOpen,
}) {
  return (
    <article
      className="fade-in-up"
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
      }}
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
      {followUps.length > 0 && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
          }}
        >
          {followUps.map((f, i) => (
            <Chip key={i} onClick={() => onFollowUp && onFollowUp(f)}>
              {f}
            </Chip>
          ))}
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
