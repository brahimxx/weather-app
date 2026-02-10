import { useState, useRef, useEffect } from "react";

/**
 * Creates a smooth cubic bezier path through data points
 */
const createSmoothPath = (points, width, height, paddingX, paddingY) => {
  if (!points || points.length < 2) return "";

  const temps = points.map((p) => p.temp);
  const minTemp = Math.min(...temps) - 2;
  const maxTemp = Math.max(...temps) + 2;
  const tempRange = maxTemp - minTemp || 1;

  const getX = (index) =>
    paddingX + (index / (points.length - 1)) * (width - paddingX * 2);
  const getY = (temp) =>
    paddingY + (1 - (temp - minTemp) / tempRange) * (height - paddingY * 2);

  const pathPoints = points.map((p, i) => ({
    x: getX(i),
    y: getY(p.temp),
  }));

  // Build smooth bezier curve
  let path = `M ${pathPoints[0].x} ${pathPoints[0].y}`;

  for (let i = 0; i < pathPoints.length - 1; i++) {
    const p0 = pathPoints[i - 1] || pathPoints[i];
    const p1 = pathPoints[i];
    const p2 = pathPoints[i + 1];
    const p3 = pathPoints[i + 2] || p2;

    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return { path, pathPoints };
};

/**
 * Temperature Graph Component
 * Displays a smooth curved line graph with gradient fill and hover tooltip
 */
const TemperatureGraph = ({
  data,
  activeTab,
  currentHourIndex = null,
  selectedIndex = null,
  onPointSelect,
}) => {
  // Use local state only for tracking if we are actively hovering, 
  // but rely on selectedIndex for the data display to ensure persistence.
  // Actually, to make "hover = select", we don't even need local state for the data, just maybe for visual feedback if needed.
  // But strictly following "keep showing the one selected", we can just use selectedIndex.

  const [dimensions, setDimensions] = useState({ width: 400, height: 120 });
  const containerRef = useRef(null);

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setDimensions({ width, height: 120 });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (!data || data.length < 2) {
    return null;
  }

  const { width, height } = dimensions;
  const paddingX = 0;
  const paddingY = 20;

  const { path, pathPoints } = createSmoothPath(
    data,
    width,
    height,
    paddingX,
    paddingY
  );

  // Create gradient fill path (closed)
  const gradientPath = `${path} L ${pathPoints[pathPoints.length - 1].x} ${height} L ${pathPoints[0].x} ${height} Z`;

  // Find current hour marker position
  const currentMarkerIndex =
    currentHourIndex !== null && currentHourIndex < pathPoints.length
      ? currentHourIndex
      : null;

  // Determine which point to display (tooltip and vertical line)
  // We use selectedIndex as the source of truth.
  const displayIndex = selectedIndex !== null && selectedIndex < pathPoints.length ? selectedIndex : null;
  const displayPoint = displayIndex !== null ? { ...pathPoints[displayIndex], data: data[displayIndex] } : null;

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${height}px` }}
    >
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id={`tempGradient-${activeTab}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-start)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent-end)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id={`lineGradient-${activeTab}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent-start)" />
            <stop offset="100%" stopColor="var(--accent-end)" />
          </linearGradient>
        </defs>

        {/* Gradient fill under curve */}
        <path
          d={gradientPath}
          fill={`url(#tempGradient-${activeTab})`}
          className="transition-all duration-500 ease-out"
        />

        {/* Main curve line */}
        <path
          d={path}
          fill="none"
          stroke={`url(#lineGradient-${activeTab})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500 ease-out"
        />

        {/* Current time marker */}
        {currentMarkerIndex !== null && (
          <g className="animate-pulse">
            <circle
              cx={pathPoints[currentMarkerIndex].x}
              cy={pathPoints[currentMarkerIndex].y}
              r="8"
              fill="var(--accent-start)"
              fillOpacity="0.3"
            />
            <circle
              cx={pathPoints[currentMarkerIndex].x}
              cy={pathPoints[currentMarkerIndex].y}
              r="5"
              fill="white"
              stroke="var(--accent-start)"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Selected/Hovered point visualization */}
        {displayPoint && (
          <g>
            {/* Vertical line */}
            <line
              x1={displayPoint.x}
              y1={paddingY}
              x2={displayPoint.x}
              y2={height}
              stroke="var(--text-secondary)"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.5"
            />
            {/* Selection Marker Ring */}
            <circle
              cx={displayPoint.x}
              cy={displayPoint.y}
              r="8"
              fill="white"
              fillOpacity="0.2"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            {/* Point circle */}
            <circle
              cx={displayPoint.x}
              cy={displayPoint.y}
              r="6"
              fill="white"
              stroke="var(--accent-start)"
              strokeWidth="2"
              className="drop-shadow-md"
            />
          </g>
        )}

        {/* Invisible hit areas for detection */}
        {pathPoints.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="12"
            fill="transparent"
            className="cursor-pointer"
            onMouseEnter={() => onPointSelect && onPointSelect(index)}
            onTouchStart={() => onPointSelect && onPointSelect(index)}
          // Removed onMouseLeave to persist selection
          />
        ))}
      </svg>

      {/* Tooltip */}
      {displayPoint && (
        <div
          className="absolute pointer-events-none z-10 px-3 py-2 rounded-xl shadow-lg transform -translate-x-1/2 transition-all duration-150"
          style={{
            left: displayPoint.x,
            top: Math.max(displayPoint.y - 75, -40),
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div className="text-[11px] text-text-secondary font-medium text-center">
            {displayPoint.data.time}
          </div>
          <div className="text-[15px] font-bold text-text-primary text-center">
            {Math.round(displayPoint.data.temp)}°
          </div>
          {/* Tooltip arrow */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0"
            style={{
              bottom: "-6px",
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid var(--bg-secondary)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TemperatureGraph;
