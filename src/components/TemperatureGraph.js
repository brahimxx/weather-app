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
  const [dimensions, setDimensions] = useState({ width: 400, height: 120 });
  const containerRef = useRef(null);

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setDimensions({ width, height });
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
    paddingY,
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
  const displayIndex =
    selectedIndex !== null && selectedIndex < pathPoints.length
      ? selectedIndex
      : null;
  const displayPoint =
    displayIndex !== null
      ? { ...pathPoints[displayIndex], data: data[displayIndex] }
      : null;

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient
            id={`tempGradient-${activeTab}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="var(--accent-start)"
              stopOpacity="0.4"
            />
            <stop
              offset="100%"
              stopColor="var(--accent-end)"
              stopOpacity="0.05"
            />
          </linearGradient>
          <linearGradient
            id={`lineGradient-${activeTab}`}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
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
              y1={displayPoint.y}
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

        {/* Invisible hit areas for detection - Vertical Strips */}
        {pathPoints.map((point, index) => {
          let x, w;

          if (index === 0) {
            // First point
            if (pathPoints.length > 1) {
              x = 0;
              w = (pathPoints[1].x + point.x) / 2;
            } else {
              x = 0;
              w = width;
            }
          } else if (index === pathPoints.length - 1) {
            // Last point
            const prevX = pathPoints[index - 1].x;
            x = (point.x + prevX) / 2;
            w = width - x;
          } else {
            // Middle points
            const prevX = pathPoints[index - 1].x;
            const nextX = pathPoints[index + 1].x;
            x = (point.x + prevX) / 2;
            w = (nextX - point.x) / 2 + (point.x - prevX) / 2;
          }

          return (
            <rect
              key={index}
              x={x}
              y={0}
              width={w}
              height={height}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => onPointSelect && onPointSelect(index)}
              onTouchStart={() => onPointSelect && onPointSelect(index)}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {displayPoint && (
        <div
          className="absolute pointer-events-none z-10 px-3 py-2 rounded-xl shadow-lg transition-all duration-150"
          style={{
            left:
              displayPoint.x < 30
                ? "0px"
                : displayPoint.x > width - 30
                ? "auto"
                : displayPoint.x,
            right: displayPoint.x > width - 30 ? "0px" : "auto",
            top: Math.max(displayPoint.y - 75, -40),
            transform:
              displayPoint.x < 30 || displayPoint.x > width - 30
                ? "none"
                : "translateX(-50%)",
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
            className="absolute w-0 h-0"
            style={{
              bottom: "-6px",
              left:
                displayPoint.x < 30
                  ? displayPoint.x
                  : displayPoint.x > width - 30
                  ? "auto"
                  : "50%",
              right: displayPoint.x > width - 30 ? width - displayPoint.x : "auto",
              transform: "translateX(-50%)",
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
