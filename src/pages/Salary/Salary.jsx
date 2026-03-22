import { useState } from 'react'
import TopBar from '../../components/layout/TopBar/TopBar'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import Modal from '../../components/common/Modal/modal'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency } from '../../utils/formatters'

export default function Salary() {
  const { employee, period, setPeriod, periodLabel, dashboardData, dashboardLoading } = useAuth()
  const [showModal, setShowModal] = useState(false)

  const salary = dashboardData?.salary

  return (
    <div className="min-h-screen bg-surface pb-32">
      <TopBar
        title="Salary Details"
        subtitle={employee.name}
        avatarUrl={employee.avatarUrl}
        period={periodLabel}
        onPeriodClick={() => setShowModal(true)}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedMonth={period.month}
        selectedYear={period.year}
        onConfirm={(month, year) => setPeriod({ month, year })}
      />

      {dashboardLoading ? (
        <div className="flex items-center justify-center h-64 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
        </div>
      ) : dashboardData && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-8">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-container to-primary p-8 text-white shadow-lg">
            <div className="relative z-10">
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-on-primary-container/80 mb-2">Total Salary Breakdown</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tighter">{formatCurrency(salary.total, '')}</span>
                <span className="text-xl font-medium opacity-80 uppercase">{salary.currency}</span>
              </div>
              <div className="mt-6 flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span className="text-[12px] font-medium">Verified for {salary.period}</span>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          </section>

          {/* Working cycle progress */}
          <section className="space-y-3">
            <div className="flex justify-between items-end px-1">
              <h2 className="text-[12px] font-bold uppercase tracking-widest text-outline">Working Cycle Progress</h2>
              <p className="text-[14px] font-bold text-primary">{salary.workingDays.completed} / {salary.workingDays.total} Days</p>
            </div>
            <div className="bg-surface-container-high h-4 w-full rounded-full overflow-hidden p-1 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-secondary to-on-secondary-container"
                style={{ width: `${(salary.workingDays.completed / salary.workingDays.total) * 100}%` }}
              ></div>
            </div>
          </section>

          {/* Earnings breakdown */}
          <section className="space-y-4">
            <h2 className="text-[12px] font-bold uppercase tracking-widest text-outline px-1">Earnings Breakdown</h2>
            <div className="space-y-3">
              {salary.components.map((item) =>
                item.highlight ? (
                  <div key={item.id} className="bg-gradient-to-r from-secondary/10 to-transparent border border-secondary/20 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                      </div>
                      <p className="text-sm font-bold text-secondary">{item.label}</p>
                    </div>
                    <p className="text-sm font-extrabold text-secondary">+{formatCurrency(item.amount, '')}</p>
                  </div>
                ) : (
                  <div key={item.id} className="bg-surface-container-lowest rounded-xl p-4 flex items-center justify-between shadow-sm border border-black/[0.02]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{item.label}</p>
                        {item.sublabel && <p className="text-[11px] text-on-surface-variant uppercase tracking-tighter">{item.sublabel}</p>}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-on-surface">{formatCurrency(item.amount, '')}</p>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Final total */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 text-center space-y-2">
            <p className="text-[12px] font-bold text-outline uppercase tracking-widest">Final Estimated Salary</p>
            <p className="text-2xl font-black text-primary tracking-tight">{formatCurrency(salary.total)}</p>
            <p className="text-[12px] text-outline font-bold tracking-tight">{salary.disclaimer}</p>
          </section>
        </main>
      )}

      <BottomNav />
    </div>
  )
}
