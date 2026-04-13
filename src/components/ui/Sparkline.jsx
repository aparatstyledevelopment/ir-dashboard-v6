const TREND_POINTS = {
  flat: [50, 50, 50, 50, 50],
  up: [80, 65, 50, 35, 20],
  down: [20, 35, 50, 65, 80],
  rising: [80, 65, 50, 35, 20],
  declining: [20, 35, 50, 65, 80],
};

export default function Sparkline({
  trend = 'flat',
  data,
  width = 40,
  height = 16,
  strokeWidth = 1.5,
  color = 'var(--text-tertiary)',
  fill = false,
}) {
  let svgPoints;
  if (data && data.length > 1) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    svgPoints = data.map((y, i) => {
      const x = (i * stepX).toFixed(2);
      const normY = ((max - y) / range) * height;
      return `${x},${normY.toFixed(2)}`;
    });
  } else {
    const pts = TREND_POINTS[trend] || TREND_POINTS.flat;
    const stepX = width / (pts.length - 1);
    svgPoints = pts.map(
      (y, i) => `${(i * stepX).toFixed(2)},${((y / 100) * height).toFixed(2)}`
    );
  }

  const polylinePoints = svgPoints.join(' ');
  const areaPoints = `0,${height} ${polylinePoints} ${width},${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block' }}
    >
      {fill && (
        <polygon
          points={areaPoints}
          fill={color}
          opacity="0.08"
        />
      )}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
