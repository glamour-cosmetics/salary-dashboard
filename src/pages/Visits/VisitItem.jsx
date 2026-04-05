export default function VisitItem({ visit, t }) {
    const isSuccess = visit.status === 'successful'

    return (
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_20px_rgba(25,28,32,0.02)] flex gap-4 items-start">
            <div className="bg-primary/5 p-3 rounded-lg mt-0.5 shrink-0">
                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className="font-bold text-on-surface text-base truncate">{visit.clientName}</h4>
                    <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider ${
                        isSuccess
                            ? 'bg-secondary/10 text-on-secondary-container'
                            : 'bg-error/10 text-error'
                    }`}>
                        {isSuccess ? t.successful : t.unsuccessful}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-on-surface-variant mb-2">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        {visit.timeFrom} – {visit.timeTo}
                    </span>
                    <span className="text-outline-variant">•</span>
                    <span>{visit.duration}</span>
                </div>
                <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide">
                    {visit.type === 'planned' ? t.planned : t.unplanned}
                </span>
            </div>
        </div>
    )
}
