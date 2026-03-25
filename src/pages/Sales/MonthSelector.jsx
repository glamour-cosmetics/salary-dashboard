const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function MonthSelector({ month, year, onPrev, onNext }) {
    return (
        <div className="flex items-center justify-between bg-surface-container-low rounded-xl px-2 py-2">
            <button onClick={onPrev} className="p-2 text-primary hover:bg-surface-container-high rounded-lg transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-on-surface font-bold text-lg">{MONTHS[month - 1]} {year}</span>
            <button onClick={onNext} className="p-2 text-primary hover:bg-surface-container-high rounded-lg transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
        </div>
    )
}
