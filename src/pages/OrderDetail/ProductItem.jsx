import { useT } from '../../i18n/useT'
import { formatCurrency } from '../../utils/formatters'

export default function ProductItem({ name, code, quantity, amount, imageUrl, isFree = false }) {
    const t = useT('orderDetail')
    return (
        <div className="bg-surface-container-lowest p-4 rounded-xl flex gap-4 items-center editorial-shadow">
            <div className="w-16 h-16 rounded-lg bg-surface-container-high shrink-0 overflow-hidden">
                {imageUrl
                    ? <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline text-2xl">inventory_2</span>
                      </div>
                }
            </div>
            <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-bold text-sm leading-tight text-on-surface line-clamp-2">{name}</h4>
                {code && <span className="text-[12px] text-outline font-mono">{code}</span>}
                <div className="flex justify-between items-center">
                    <span className="text-xs text-on-surface-variant font-medium">{t.qty.replace('{{n}}', quantity)}</span>
                    {isFree
                        ? <span className="text-xs font-bold text-secondary uppercase tracking-wider">{t.free}</span>
                        : <span className="text-sm font-bold text-primary">{formatCurrency(amount, '').trim()}</span>
                    }
                </div>
            </div>
        </div>
    )
}
