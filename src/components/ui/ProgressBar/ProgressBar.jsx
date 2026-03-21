/**
 * Linear progress bar
 * Props: value (0–100), label?, showValue?
 */
export default function ProgressBar({ value, label, showValue = true }) {
  const clamped = Math.min(Math.max(value, 0), 100)
  return (
    <div className="flex flex-col gap-1.5">
      {(label || showValue) && (
        <div className="flex justify-between text-xs text-on-surface-variant">
          {label && <span>{label}</span>}
          {showValue && <span>{clamped}%</span>}
        </div>
      )}
      <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
