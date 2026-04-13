// Waterfall chart — visualizes a sequence of positive (+) and negative
// (−) contributions with running total. Good for net-flow stories like
// "net ownership change over the past 30 days".
export default function WaterfallChart({
  data,
  width = 560,
  height = 180,
  valueFormatter = (v) => (v > 0 ? `+${v}` : String(v)),
}) {
  const padding = { top: 22, right: 16, bottom: 30, left: 36 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const barWidth = (innerW / data.length) * 0.72;
  const step = innerW / data.length;

  // Compute running totals so we can size bars.
  let running = 0;
  const enriched = data.map((d) => {
    const from = running;
    running += d.value;
    return { ...d, from, to: running };
  });
  const minVal = Math.min(0, ...enriched.map((d) => Math.min(d.from, d.to)));
  const maxVal = Math.max(0, ...enriched.map((d) => Math.max(d.from, d.to)));
  const range = maxVal - minVal || 1;

  const yScale = (v) =>
    padding.top + (1 - (v - minVal) / range) * innerH;

  const zeroY = yScale(0);

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
      {/* Zero line */}
      <line
        x1={padding.left}
        x2={width - padding.right}
        y1={zeroY}
        y2={zeroY}
        stroke="var(--border)"
        strokeWidth="1"
      />
      {enriched.map((d, i) => {
        const cxBar = padding.left + step * i + step / 2;
        const x = cxBar - barWidth / 2;
        const yTop = yScale(Math.max(d.from, d.to));
        const yBottom = yScale(Math.min(d.from, d.to));
        const h = Math.max(2, yBottom - yTop);
        const isPos = d.value >= 0;
        const fill = isPos ? '#111111' : '#AAAAAA';
        return (
          <g key={i}>
            <rect x={x} y={yTop} width={barWidth} height={h} fill={fill} />
            {/* value label */}
            <text
              x={cxBar}
              y={yTop - 6}
              textAnchor="middle"
              fontSize="10"
              fontWeight="500"
              fill="var(--text-primary)"
              fontFamily="Inter"
            >
              {valueFormatter(d.value)}
            </text>
            {/* category label */}
            <text
              x={cxBar}
              y={height - padding.bottom + 14}
              textAnchor="middle"
              fontSize="10"
              fill="var(--text-tertiary)"
              fontFamily="Inter"
            >
              {d.label}
            </text>
            {/* connector to next bar */}
            {i < enriched.length - 1 && (
              <line
                x1={x + barWidth}
                x2={padding.left + step * (i + 1) + step / 2 - barWidth / 2}
                y1={yScale(d.to)}
                y2={yScale(d.to)}
                stroke="var(--text-tertiary)"
                strokeWidth="1"
                strokeDasharray="2 3"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
