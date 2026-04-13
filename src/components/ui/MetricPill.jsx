export default function MetricPill({ label, value }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-[3px] tabular"
      style={{
        background: 'var(--surface-dark)',
        color: 'var(--surface-dark-text)',
        padding: '5px 10px',
        fontSize: '10px',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ opacity: 0.6 }}>{label}</span>
      <span>{value}</span>
    </span>
  );
}
