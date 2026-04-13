const TREND_POINTS = {
  flat: [50, 50, 50, 50, 50],
  up: [80, 65, 50, 35, 20],
  down: [20, 35, 50, 65, 80],
  rising: [80, 65, 50, 35, 20],
  declining: [20, 35, 50, 65, 80],
};

export default function Sparkline({ trend = 'flat', width = 40, height = 16 }) {
  const pts = TREND_POINTS[trend] || TREND_POINTS.flat;
  const stepX = width / (pts.length - 1);
  const points = pts
    .map((y, i) => `${(i * stepX).toFixed(1)},${((y / 100) * height).toFixed(1)}`)
    .join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block' }}
    >
      <polyline
        points={points}
        fill="none"
        stroke="var(--text-tertiary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
