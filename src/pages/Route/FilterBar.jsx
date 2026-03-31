import { useT } from '../../i18n/useT'

const WEEKDAY_KEYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export default function FilterBar({ date, likelyToOrder, onToggleLikely, activeDay, onDaySelect }) {
    const t = useT('route')
    return (
        <section className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
                    <span className="text-sm font-medium">{date}</span>
                    <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
                </div>
                {/* <button
                    onClick={onToggleLikely}
                    className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between"
                >
                    <span className="text-[11px] font-bold uppercase tracking-wider leading-none">{t.likelyToOrder}</span>
                    <div className={`w-10 h-5 rounded-full relative flex items-center px-1 transition-colors ${likelyToOrder ? 'bg-secondary' : 'bg-outline-variant'}`}>
                        <div className={`w-3.5 h-3.5 bg-white rounded-full transition-all ${likelyToOrder ? 'ml-auto' : 'mr-auto'}`} />
                    </div>
                </button> */}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
                {WEEKDAY_KEYS.map((key, i) => (
                    <button
                        key={key}
                        onClick={() => onDaySelect(key)}
                        className={`py-2 rounded-full text-[10px] font-bold tracking-wide transition-colors ${
                            activeDay === key
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                    >
                        {t.weekdays[i]}
                    </button>
                ))}
            </div>
        </section>
    )
}
