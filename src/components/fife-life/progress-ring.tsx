"use client";

type ProgressRingProps = {
  /**
   * Current progress value (e.g., points earned or visits completed)
   */
  value: number;
  /**
   * Maximum value (e.g., points required or total visits)
   */
  max: number;
  /**
   * Diameter of the ring in pixels
   */
  size?: number;
  /**
   * Thickness of the progress ring
   */
  strokeWidth?: number;
  /**
   * Color of the progress ring
   */
  color?: string;
  /**
   * Content to display in the center (typically a logo)
   */
  children?: React.ReactNode;
};

export function ProgressRing({
  value,
  max,
  size = 64,
  strokeWidth = 3,
  color = "#a68bff",
  children,
}: ProgressRingProps) {
  const progress = Math.min(Math.max(value / Math.max(1, max), 0), 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: `drop-shadow(0 0 4px ${color}40)`,
          }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
