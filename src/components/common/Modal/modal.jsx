import { useState } from 'react'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function buildMonthList() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 1-based

  const months = []
  for (let m = 1; m <= currentMonth; m++) {
    months.push({ month: m, year: currentYear })
  }
  return months.reverse() // most recent first
}

export default function Modal({ isOpen, onClose, selectedMonth, selectedYear, onConfirm }) {
  const [pending, setPending] = useState({ month: selectedMonth, year: selectedYear })
  const months = buildMonthList()

  if (!isOpen) return null

  function handleConfirm() {
    onConfirm(pending.month, pending.year)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-on-background/40 backdrop-blur-sm flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest w-full max-w-md rounded-t-[2rem] md:rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-on-surface">Select Period</h2>
            <p className="text-[10px] text-outline uppercase tracking-widest mt-1">Fiscal Year {pending.year}</p>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center bg-surface-container-high rounded-full text-on-surface-variant active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-4 pb-4 max-h-[400px] overflow-y-auto">
          <div className="space-y-1">
            {months.map(({ month, year }) => {
              const isSelected = month === pending.month && year === pending.year
              return (
                <button
                  key={`${year}-${month}`}
                  onClick={() => setPending({ month, year })}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-colors ${
                    isSelected
                      ? 'bg-primary-container text-white shadow-lg relative overflow-hidden'
                      : 'hover:bg-surface-container-low group'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <div className="relative z-10 flex flex-col items-start">
                        <span className="font-bold">{MONTH_NAMES[month - 1]} {year}</span>
                        {/* <span className="text-[10px] uppercase tracking-widest opacity-80">Current Selection</span> */}
                      </div>
                      <span className="material-symbols-outlined relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-on-surface-variant group-hover:text-on-surface">
                        {MONTH_NAMES[month - 1]} {year}
                      </span>
                      <span className="material-symbols-outlined text-surface-container-highest">chevron_right</span>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="px-8 pb-8 pt-4">
          <button
            onClick={handleConfirm}
            className="w-full bg-surface-container-high py-4 rounded-xl font-bold text-primary active:scale-95 transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
