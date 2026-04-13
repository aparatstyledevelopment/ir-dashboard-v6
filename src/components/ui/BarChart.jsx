import { formatCurrencyEUR } from '../../utils/formatters';

export default function BarChart({ data, highlightKey, valueFormatter = formatCurrencyEUR }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {data.map((d, i) => {
        const pct = max > 0 ? (d.value / max) * 100 : 0;
        const isHighlight = d.key === highlightKey;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                  background: 'var(--bar-fill)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
