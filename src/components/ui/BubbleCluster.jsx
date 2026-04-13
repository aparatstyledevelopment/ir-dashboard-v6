// Bubble scatter chart — maps each item onto an x/y plane with bubble
// size encoding a third dimension (usually score or AUM). Good for
// showing the distribution of targets across a fit x conviction space.

export default function BubbleCluster({
  data,
  xAxis = { label: 'Peer overlap' },
  yAxis = { label: 'AI fit score' },
  width = 560,
  height = 260,
  xMax = 5,
  yMax = 100,
}) {
  const padding = { top: 18, right: 24, bottom: 34, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const xScale = (v) => padding.left + (v / xMax) * innerW;
  const yScale = (v) => padding.top + (1 - v / yMax) * innerH;

  // Compute bubble radius from a size field. Fallback to constant 8.
  const sizes = data.map((d) => d.size || 12);
  const maxSize = Math.max(...sizes, 1);
  const rScale = (v) => 6 + ((v || 12) / maxSize) * 14;

  // Grid lines
  const yTicks = [0, 25, 50, 75, 100];
  const xTicks = [0, 1, 2, 3, 4, 5];

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      style={{
        display: 'block',
        maxWidth: '100%',
        border: '1px solid var(--border)',
        borderRadius: '4px',
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
      {/* Axis labels */}
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
        fontSize="10"
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
        fontSize="10"
        fill="var(--text-tertiary)"
        fontFamily="Inter"
        transform={`rotate(-90 14 ${height / 2})`}
        style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}
      >
        {yAxis.label}
      </text>
      {/* Bubbles */}
      {data.map((d, i) => {
        const cx = xScale(d.x);
        const cy = yScale(d.y);
        const r = rScale(d.size);
        const fill =
          d.priority === 'Hot'
            ? '#111111'
            : d.priority === 'Warm'
            ? '#555555'
            : '#AAAAAA';
        return (
          <g key={d.id || i}>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={fill}
              fillOpacity="0.75"
              stroke={fill}
              strokeWidth="1"
            />
            <text
              x={cx}
              y={cy - r - 4}
              textAnchor="middle"
              fontSize="9"
              fill="var(--text-primary)"
              fontFamily="Inter"
              fontWeight="500"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
