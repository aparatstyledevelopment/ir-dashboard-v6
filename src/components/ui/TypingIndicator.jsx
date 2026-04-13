export default function TypingIndicator() {
  const dotStyle = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--text-tertiary)',
    display: 'inline-block',
  };

  return (
    <div
      className="fade-in-up"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '14px 16px',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        background: 'var(--bg)',
        width: 'fit-content',
      }}
      aria-label="Generating response"
    >
      <span className="dot-pulse" style={{ ...dotStyle, animationDelay: '0s' }} />
      <span className="dot-pulse" style={{ ...dotStyle, animationDelay: '0.18s' }} />
      <span className="dot-pulse" style={{ ...dotStyle, animationDelay: '0.36s' }} />
    </div>
  );
}
