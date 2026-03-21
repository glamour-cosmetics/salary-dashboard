/**
 * Small metric card with icon, value, and label
 * Props: icon, value, label, accent? ('primary'|'secondary'|'tertiary')
 */
export default function StatCard({ icon, value, label, accent = 'primary' }) {
  const accentClasses = {
    primary: 'bg-primary-container text-on-primary-container',
    secondary: 'bg-secondary-container text-on-secondary-container',
    tertiary: 'bg-tertiary-container text-on-tertiary-container',
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${accentClasses[accent]}`}>
        <span className="material-symbols-outlined text-xl leading-none">{icon}</span>
      </div>
      <p className="text-lg font-bold text-on-surface leading-tight">{value}</p>
      <p className="text-xs text-on-surface-variant">{label}</p>
    </div>
  )
}
