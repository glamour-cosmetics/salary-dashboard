import { useT } from '../../i18n/useT'
import { formatCurrency } from '../../utils/formatters'

export default function DailySummary({ date, netRevenue, totalOrders, totalReturns, currency = 'UZS' }) {
    const t = useT('sales')
    const fmt = (v) => formatCurrency(v, '').trim()
    return (
        <section className="mb-8">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-gradient-to-br from-primary-container to-primary p-6 rounded-xl text-on-primary">
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">{t.netRevenue}</span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-bold tracking-tight">{fmt(netRevenue)}</span>
                        <span className="text-sm font-medium opacity-80">{currency}</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-xl">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-outline">{t.totalOrders}</span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-bold text-on-surface">{fmt(totalOrders)}</span>
                        <span className="text-[10px] font-medium text-outline">{currency}</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-xl">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-outline">{t.totalReturns}</span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-bold text-error">{fmt(totalReturns)}</span>
                        <span className="text-[10px] font-medium text-outline">{currency}</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
