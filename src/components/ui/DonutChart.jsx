// SVG donut chart with center label and legend. Uses the grayscale
// design palette — slices are distinguishable by shade, not hue.
//
// Props:
//   data: [{ key, label, value, sub? }]
//   size, stroke: pixel dimensions
//   centerValue, centerLabel: rendered inside the donut
//   valueFormatter: (v) => string used in legend
//   highlightKey: optional key to bold in legend

const GRAY_SCALE = ['#111111', '#3B3B3B', '#666666', '#8E8E8E', '#B4B4B4', '#D6D6D6'];

export default function DonutChart({
  data,
  size = 172,
  stroke = 26,
  centerValue,
  centerLabel,
  valueFormatter = (v) => `${v}%`,
  highlightKey,
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = data.map((d, i) => {
    const portion = d.value / total;
    const len = portion * circumference;
    const color = d.color || GRAY_SCALE[i % GRAY_SCALE.length];
    const el = (
      <circle
        key={d.key || i}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${len.toFixed(2)} ${(circumference - len).toFixed(2)}`}
        strokeDashoffset={(-offset).toFixed(2)}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    );
    offset += len;
    return el;
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size}>
          {/* track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--bar-track)"
            strokeWidth={stroke}
          />
          {segments}
        </svg>
        {(centerValue || centerLabel) && (
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
            {centerValue && (
              <div
                className="tabular"
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {centerValue}
              </div>
            )}
            {centerLabel && (
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                  marginTop: '4px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {centerLabel}
              </div>
            )}
          </div>
        )}
      </div>

      <ul
        className="tabular"
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
          minWidth: '180px',
        }}
      >
        {data.map((d, i) => {
          const color = d.color || GRAY_SCALE[i % GRAY_SCALE.length];
          const isHighlight = d.key === highlightKey;
          return (
            <li
              key={d.key || i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px',
                fontSize: '12px',
                letterSpacing: '-0.01em',
              }}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  background: color,
                  flexShrink: 0,
                  alignSelf: 'center',
                }}
              />
              <span
                style={{
                  flex: 1,
                  color: 'var(--text-primary)',
                  fontWeight: isHighlight ? 600 : 400,
                }}
              >
                {d.label}
              </span>
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: isHighlight ? 600 : 500,
                }}
              >
                {valueFormatter(d.value)}
              </span>
              {d.sub && (
                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-tertiary)',
                    flexShrink: 0,
                  }}
                >
                  {d.sub}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
