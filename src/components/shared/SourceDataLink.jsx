export default function SourceDataLink({ module, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen && onOpen(module)}
      style={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        marginTop: '12px',
        fontSize: '11px',
        color: 'var(--text-tertiary)',
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        cursor: 'pointer',
        letterSpacing: '-0.01em',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
    >
      View source data → {module}
    </button>
  );
}
