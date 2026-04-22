import { formatCurrencyEUR } from '../../utils/formatters';

// Horizontal bar chart.
//
// `baseline` controls the floor the bar lengths are measured from:
//   'auto'  — if values are tightly clustered (range < 15% of max),
//             zoom to [min - 0.2·range, max] so differences are visible.
//             Otherwise use 0.
//   'zero'  — always start bars at 0.
//   number  — use the given number as the floor.
export default function BarChart({
  data,
  highlightKey,
  valueFormatter = formatCurrencyEUR,
  baseline = 'auto',
}) {
  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min;

  let floor = 0;
  let zoomed = false;
  if (baseline === 'auto') {
    // Zoom when values are tightly clustered, so subtle differences
    // don't all look like the same-length bar.
    if (max > 0 && range > 0 && range / Math.abs(max) < 0.15) {
      floor = Math.max(0, min - range * 0.2);
      zoomed = floor > 0;
    }
  } else if (typeof baseline === 'number') {
    floor = baseline;
    zoomed = floor > 0;
  }

  const denom = max - floor || 1;

  return (
    <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {data.map((d, i) => {
        const raw = ((d.value - floor) / denom) * 100;
        // Clamp to [4%, 100%] so the smallest bar still has a visible nub.
        const pct = Math.max(4, Math.min(100, raw));
        const isHighlight = d.key === highlightKey;
        return (
          <div
            key={d.key || i}
            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                fontSize: '12px',
                letterSpacing: '-0.01em',
              }}
            >
              <span
                style={{
                  fontWeight: isHighlight ? 600 : 400,
                  color: 'var(--text-primary)',
                }}
              >
                {d.label}
              </span>
              <span
                className="tabular"
                style={{
                  fontWeight: isHighlight ? 600 : 400,
                  color: 'var(--text-secondary)',
                }}
              >
                {valueFormatter(d.value)}
              </span>
            </div>
            <div
              style={{
                position: 'relative',
                height: '20px',
                background: 'var(--bar-track)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: d.color || 'var(--bar-fill)',
                }}
              />
            </div>
          </div>
        );
      })}
      {zoomed && (
        <div
          className="tabular"
          style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            marginTop: '2px',
            letterSpacing: '-0.01em',
          }}
        >
          Chart zoomed to {valueFormatter(floor)}–{valueFormatter(max)} range (values differ by only{' '}
          {valueFormatter(range)}).
        </div>
      )}
    </div>
  );
}
