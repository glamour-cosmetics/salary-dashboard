import { formatCurrency } from '../../utils/formatters'
import { useT } from '../../i18n/useT'

function StatCell({ label, value, accent }) {
    const fmt = formatCurrency(value, '').trim()
    return (
        <div className={`bg-surface-container-low p-2 rounded-lg min-w-0 ${accent ? 'border-l-2 border-tertiary-fixed-dim' : ''}`}>
            <p className="text-[9px] font-bold uppercase tracking-tighter text-outline mb-1 truncate">{label}</p>
            <p className="text-xs font-bold truncate">{fmt} <span className="text-[9px] text-outline">UZS</span></p>
        </div>
    )
}

export default function ClientCard({ client }) {
    const t = useT('route')
    const { name, address, phone, location, thisMonth, avgOrder, plan, lastOrderDays } = client

    const lastOrderBg = lastOrderDays > 60 ? 'bg-error-container text-on-error-container'
        : lastOrderDays > 30 ? 'bg-tertiary-container text-on-tertiary-container'
        : 'bg-secondary-container text-on-secondary-container'

    const mapUrl = location
        ? `https://yandex.ru/maps/?pt=${location.split(',').reverse().join(',')}&z=16&l=map`
        : null

    return (
        <article className="bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(25,28,32,0.06)] overflow-hidden">
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-on-surface leading-tight mb-1 truncate">{name}</h3>
                        <div className="flex items-center gap-2 text-[11px] font-medium text-on-surface-variant min-w-0">
                            <span className="material-symbols-outlined text-xs shrink-0">location_on</span>
                            <span className="truncate">{address}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <a
                            href={`tel:${phone}`}
                            className="w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center text-primary"
                        >
                            <span className="material-symbols-outlined">call</span>
                        </a>
                        {mapUrl
                            ? <a
                                href={mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center text-primary"
                              >
                                <span className="material-symbols-outlined">map</span>
                              </a>
                            : <button className="w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center text-outline" disabled>
                                <span className="material-symbols-outlined">map</span>
                              </button>
                        }
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                    <StatCell label={t.thisMonth} value={thisMonth} />
                    <StatCell label={t.avgOrder} value={avgOrder} />
                    <StatCell label={t.plan} value={plan} accent />
                </div>

                <div className="flex justify-end">
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${lastOrderBg}`}>
                        {t.daysAgo.replace('{{n}}', lastOrderDays)}
                    </div>
                </div>
            </div>
        </article>
    )
}
