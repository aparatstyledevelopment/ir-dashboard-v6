// Single-value circular progress ring. Good for scores and metrics.
export default function ProgressRing({
  value,
  max = 100,
  size = 120,
  stroke = 10,
  label,
  sub,
  suffix = '',
  color = 'var(--text-primary)',
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  const len = pct * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--bar-track)"
          strokeWidth={stroke}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${len.toFixed(2)} ${(circumference - len).toFixed(2)}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          className="tabular"
          style={{
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          {value}
          {suffix}
        </div>
        {label && (
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              marginTop: '4px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </div>
        )}
        {sub && (
          <div
            style={{
              fontSize: '9px',
              color: 'var(--text-tertiary)',
              marginTop: '1px',
              letterSpacing: '-0.01em',
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
