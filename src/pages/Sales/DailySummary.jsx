import { useT } from '../../i18n/useT'
import { formatCurrency, formatPercent } from '../../utils/formatters'

export default function DailySummary({ date, netRevenue, totalOrders, totalReturns, dailyPlan = 0, dailyAchievement = 0, firstVisit = null, lastVisit = null, currency = 'UZS' }) {
    const t = useT('sales')
    const fmt = (v) => formatCurrency(v, '').trim()
    // API returns "HH:MM:SS" in UTC — convert to UTC+5 and display HH:MM
    const fmtTime = (v) => {
        if (!v) return '—'
        const [h, m] = v.split(':').map(Number)
        const totalMin = (h * 60 + m + 5 * 60) % (24 * 60)
        const hh = String(Math.floor(totalMin / 60)).padStart(2, '0')
        const mm = String(totalMin % 60).padStart(2, '0')
        return `${hh}:${mm}`
    }
    return (
        <section className="mb-8">
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-container-lowest p-4 rounded-xl flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-outline">{t.startTime}</span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="material-symbols-outlined text-secondary text-lg">login</span>
                        <span className="text-xl font-bold text-on-surface">{fmtTime(firstVisit)}</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-xl flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-outline">{t.endTime}</span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="material-symbols-outlined text-error text-lg">logout</span>
                        <span className="text-xl font-bold text-on-surface">{fmtTime(lastVisit)}</span>
                    </div>
                </div>
            </div>

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
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-surface-container-lowest p-4 rounded-xl">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-outline">{t.dailySalesPlan}</span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-bold text-on-surface">{fmt(dailyPlan)}</span>
                        <span className="text-[10px] font-medium text-outline">{currency}</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-xl">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-outline">{t.dailyAchievement}</span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className={`text-lg font-bold ${dailyAchievement >= 100 ? 'text-secondary' : 'text-primary'}`}>
                            {formatPercent(dailyAchievement)}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
