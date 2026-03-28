import { useT } from '../../i18n/useT'

const SORT_KEYS = ['days_since_last_order', 'avg_monthly_net_sales']

export default function SortBar({ sortBy, sortDir, onSortChange, onDirToggle }) {
    const t = useT('route')
    const dirLabel = sortDir === 'Desc' ? t.sortDesc : t.sortAsc

    function cycleSort() {
        const next = SORT_KEYS[(SORT_KEYS.indexOf(sortBy) + 1) % SORT_KEYS.length]
        onSortChange(next)
    }

    return (
        <div className="sticky top-[72px] z-40 bg-surface/95 backdrop-blur-sm -mx-4 px-4 py-3 mb-4 flex items-center justify-between">
            <button onClick={cycleSort} className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-outline">{t.sortBy}</span>
                <span className="text-xs font-semibold text-primary">{t.sortOptions[sortBy]}</span>
                <span className="material-symbols-outlined text-primary text-[14px]">swap_horiz</span>
            </button>
            <button
                onClick={onDirToggle}
                className="bg-surface-container-high p-1.5 rounded-lg flex items-center gap-1"
            >
                <span className="material-symbols-outlined text-sm">swap_vert</span>
                <span className="text-[10px] font-bold uppercase">{dirLabel}</span>
            </button>
        </div>
    )
}
