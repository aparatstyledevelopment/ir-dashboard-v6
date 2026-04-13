export default function Chip({ children, onClick, spent = false, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || spent}
      className="transition-colors"
      style={{
        background: 'var(--bg)',
        border: `1px solid ${spent ? '#EFEFEF' : 'var(--border)'}`,
        color: spent ? 'var(--text-tertiary)' : 'var(--text-primary)',
        padding: '8px 14px',
        fontSize: '12px',
        fontWeight: 400,
        letterSpacing: '-0.01em',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
        cursor: spent ? 'default' : 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!spent) e.currentTarget.style.background = 'var(--bar-track)';
      }}
      onMouseLeave={(e) => {
        if (!spent) e.currentTarget.style.background = 'var(--bg)';
      }}
    >
      {children}
    </button>
  );
}
