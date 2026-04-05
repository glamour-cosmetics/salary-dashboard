export default function VisitSummaryCard({ summary, t }) {
    const pct = summary.visitsPlan > 0
        ? Math.round((summary.visitsDone / summary.visitsPlan) * 100)
        : 0

    return (
        <section className="bg-surface-container-low rounded-xl p-6 mb-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="flex justify-between items-start gap-4 mb-6">
                <div className="min-w-0">
                    <p className="text-on-surface-variant font-label uppercase text-[10px] tracking-[0.1em] mb-1">{t.workplace}</p>
                    <p className="text-on-surface font-semibold text-lg truncate">{summary.workplace || '—'}</p>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-on-surface-variant font-label uppercase text-[10px] tracking-[0.1em] mb-1">{t.date}</p>
                    <p className="text-on-surface font-medium">{summary.date || '—'}</p>
                </div>
            </div>

            <div className="mb-8 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tighter text-primary">{summary.visitsDone}</span>
                <span className="text-2xl font-medium text-outline">/ {summary.visitsPlan}</span>
                <span className="ml-auto bg-secondary-container/30 text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">
                    {pct}% {t.target}
                </span>
            </div>

            <div className="grid grid-cols-3 border-t border-outline-variant/10 pt-6">
                <div className="flex flex-col items-center text-center">
                    <p className="text-[10px] font-label uppercase text-outline mb-1">{t.firstVisit}</p>
                    <p className="text-on-surface font-bold">{summary.firstVisitTime ?? '—'}</p>
                </div>
                <div className="flex flex-col items-center text-center border-x border-outline-variant/10">
                    <p className="text-[10px] font-label uppercase text-outline mb-1">{t.lastVisit}</p>
                    <p className="text-on-surface font-bold">{summary.lastVisitTime ?? '—'}</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <p className="text-[10px] font-label uppercase text-outline mb-1">{t.avgTime}</p>
                    <p className="text-on-surface font-bold">{summary.avgVisitTime ?? '—'}</p>
                </div>
            </div>
        </section>
    )
}
