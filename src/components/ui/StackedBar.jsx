// Horizontal stacked bar — composition visualization where each segment
// represents a portion of the whole. Uses grayscale palette.
const GRAY_SCALE = ['#111111', '#3B3B3B', '#666666', '#8E8E8E', '#B4B4B4', '#D6D6D6'];

export default function StackedBar({
  data,
  label,
  total,
  valueFormatter = (v) => `${v.toFixed(1)}%`,
  height = 32,
}) {
  const sum = data.reduce((s, d) => s + d.value, 0) || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            letterSpacing: '-0.01em',
          }}
        >
          <span>{label}</span>
          {total != null && (
            <span className="tabular" style={{ color: 'var(--text-secondary)' }}>
              {total}
            </span>
          )}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          height: `${height}px`,
          borderRadius: '4px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}
      >
        {data.map((d, i) => {
          const pct = (d.value / sum) * 100;
          const color = d.color || GRAY_SCALE[i % GRAY_SCALE.length];
          return (
            <div
              key={d.key || i}
              title={`${d.label}: ${valueFormatter(d.value)}`}
              style={{
                width: `${pct}%`,
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: i < 2 ? '#fff' : '#000',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {pct >= 6 ? valueFormatter(d.value) : ''}
            </div>
          );
        })}
      </div>
      <ul
        className="tabular"
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '11px',
          letterSpacing: '-0.01em',
        }}
      >
        {data.map((d, i) => {
          const color = d.color || GRAY_SCALE[i % GRAY_SCALE.length];
          return (
            <li
              key={d.key || i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  background: color,
                }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>{d.label}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                {valueFormatter(d.value)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
