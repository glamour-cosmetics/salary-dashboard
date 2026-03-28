import { useT } from '../../i18n/useT'

function buildDays(year, month) {
    const firstDow = (new Date(year, month - 1, 1).getDay() + 6) % 7 // Mon=0
    const daysInMonth = new Date(year, month, 0).getDate()
    const prevMonthDays = new Date(year, month - 1, 0).getDate()

    const days = []
    for (let i = firstDow - 1; i >= 0; i--)
        days.push({ day: prevMonthDays - i, prev: true })
    for (let d = 1; d <= daysInMonth; d++)
        days.push({ day: d })
    const trailing = (7 - (days.length % 7)) % 7
    for (let d = 1; d <= trailing; d++)
        days.push({ day: d, next: true })
    return days
}

export default function SalesCalendar({ year, month, selectedDay, onDaySelect, onPrevMonth, onNextMonth }) {
    const t = useT('sales')
    const days = buildDays(year, month)
    const today = new Date()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month

    return (
        <section className="bg-surface-container-low rounded-xl p-5 mb-6">
            <div className="grid grid-cols-7 gap-1 mb-4">
                {t.days.map(d => (
                    <div key={d} className="text-center text-[10px] font-bold uppercase tracking-widest text-outline">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                {days.map((cell, i) => {
                    if (cell.prev || cell.next) {
                        return (
                            <button
                                key={i}
                                onClick={() => {
                                    cell.prev ? onPrevMonth() : onNextMonth()
                                    onDaySelect(cell.day)
                                }}
                                className="aspect-square flex items-center justify-center text-outline/30 text-sm rounded-lg hover:bg-surface-container transition-colors"
                            >
                                {cell.day}
                            </button>
                        )
                    }

                    const isSelected = cell.day === selectedDay
                    const isToday = isCurrentMonth && cell.day === today.getDate()

                    return (
                        <button
                            key={i}
                            onClick={() => onDaySelect(cell.day)}
                            className="aspect-square flex items-center justify-center relative rounded-lg transition-colors hover:bg-surface-container-high"
                        >
                            {isSelected
                                ? <div className="absolute inset-1 bg-primary rounded-lg" />
                                : isToday
                                    ? <div className="absolute inset-1 bg-primary-container rounded-lg" />
                                    : null
                            }
                            <span className={`z-10 text-sm font-medium ${isSelected ? 'text-on-primary font-bold' : isToday ? 'text-on-primary-container' : 'text-on-surface'}`}>
                                {cell.day}
                            </span>
                        </button>
                    )
                })}
            </div>
        </section>
    )
}
