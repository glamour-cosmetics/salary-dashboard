/**
 * SVG circular progress indicator
 * Props: value (0–100+), size?, strokeWidth?, label?, sublabel?
 */
export default function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedValue = Math.min(value, 100)
  const offset = circumference - (clampedValue / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-container-high"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-500"
        />
      </svg>

      {label && (
        <div className="text-center -mt-1">
          <p className="text-base font-bold text-on-surface leading-tight">{label}</p>
          {sublabel && <p className="text-xs text-on-surface-variant">{sublabel}</p>}
        </div>
      )}
    </div>
  )
}
