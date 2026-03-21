import { formatCurrency } from '../../../utils/formatters'

/**
 * Single row in the earnings breakdown list
 * Props: icon, label, amount, currency?, highlight?
 */
export default function EarningRow({ icon, label, amount, currency = 'UZS', highlight = false }) {
  return (
    <div className={`flex items-center gap-3 py-3 ${highlight ? 'opacity-100' : 'opacity-90'}`}>
      <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-lg leading-none text-on-surface-variant">{icon}</span>
      </div>
      <span className="flex-1 text-sm text-on-surface">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-primary' : 'text-on-surface'}`}>
        {formatCurrency(amount, currency)}
      </span>
    </div>
  )
}
