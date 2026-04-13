// Bubble scatter — each item is mapped onto an x/y plane with bubble
// size encoding a third dimension (usually AUM). To avoid overlapping
// labels, bubbles are numbered 1..N inside the chart and a side legend
// lists the full names.
//
// Color is driven by priority: Hot = black, Warm = mid gray, Cold = light.

const PRIORITY_COLOR = {
  Hot: '#111111',
  Warm: '#555555',
  Cold: '#B4B4B4',
};

export default function BubbleCluster({
  data,
  xAxis = { label: 'Peer overlap' },
  yAxis = { label: 'AI fit score' },
  width = 560,
  height = 280,
  xMax = 5,
  yMax = 100,
}) {
  const padding = { top: 18, right: 20, bottom: 34, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const xScale = (v) => padding.left + (v / xMax) * innerW;
  const yScale = (v) => padding.top + (1 - v / yMax) * innerH;

  const sizes = data.map((d) => d.size || 12);
  const maxSize = Math.max(...sizes, 1);
  const rScale = (v) => 9 + ((v || 12) / maxSize) * 8;

  const yTicks = [0, 25, 50, 75, 100];
  const xTicks = [0, 1, 2, 3, 4, 5];

  return (
    <div
      style={{
        display: 'flex',
        gap: '18px',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}
    >
      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{
          display: 'block',
          maxWidth: '100%',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          flex: '1 1 360px',
          minWidth: 0,
        }}
      >
        {/* Grid */}
        {yTicks.map((t) => (
          <line
            key={`y-${t}`}
            x1={padding.left}
            x2={width - padding.right}
            y1={yScale(t)}
            y2={yScale(t)}
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
        ))}

        {/* Y axis labels */}
        {yTicks.map((t) => (
          <text
            key={`yl-${t}`}
            x={padding.left - 8}
            y={yScale(t) + 3}
            textAnchor="end"
            fontSize="9"
            fill="var(--text-tertiary)"
            fontFamily="Inter"
          >
            {t}
          </text>
        ))}

        {/* X axis labels */}
        {xTicks.map((t) => (
          <text
            key={`xl-${t}`}
            x={xScale(t)}
            y={height - padding.bottom + 14}
            textAnchor="middle"
            fontSize="9"
            fill="var(--text-tertiary)"
            fontFamily="Inter"
          >
            {t}
          </text>
        ))}

        {/* Axis titles */}
        <text
          x={width / 2}
          y={height - 6}
          textAnchor="middle"
          fontSize="9"
          fill="var(--text-tertiary)"
          fontFamily="Inter"
          style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}
        >
          {xAxis.label}
        </text>
        <text
          x={14}
          y={height / 2}
          textAnchor="middle"
          fontSize="9"
          fill="var(--text-tertiary)"
          fontFamily="Inter"
          transform={`rotate(-90 14 ${height / 2})`}
          style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}
        >
          {yAxis.label}
        </text>

        {/* Bubbles — numbered */}
        {data.map((d, i) => {
          const cx = xScale(d.x);
          const cy = yScale(d.y);
          const r = rScale(d.size);
          const fill = PRIORITY_COLOR[d.priority] || '#555555';
          return (
            <g key={d.id || i}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={fill}
                fillOpacity="0.82"
                stroke={fill}
                strokeWidth="1"
              >
                <title>{d.label}</title>
              </circle>
              <text
                x={cx}
                y={cy + 3}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="#ffffff"
                fontFamily="Inter"
              >
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Side legend */}
      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flex: '0 1 210px',
          minWidth: '170px',
          fontSize: '11px',
          letterSpacing: '-0.01em',
        }}
      >
        {data.map((d, i) => {
          const fill = PRIORITY_COLOR[d.priority] || '#555555';
          return (
            <li
              key={d.id || i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-secondary)',
              }}
            >
              <span
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: fill,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  flex: 1,
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {d.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
