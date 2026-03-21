import { useState } from 'react'
import TopBar from '../../components/layout/TopBar/TopBar'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import { mockEmployee, mockKPI, mockSalary } from '../../data/mockData'
import { formatCurrency, formatPercent } from '../../utils/formatters'

export default function KPI() {
  const [revenueExpanded, setRevenueExpanded] = useState(false)
  const { planAchievement, actualRevenue, ordersTotal, returnsTotal, salesPlan, overplan, acb, overachievementSteps } = mockKPI

  return (
    <div className="min-h-screen bg-surface pb-32">
      <TopBar
        title="KPI Details"
        subtitle={mockEmployee.name}
        avatarUrl={mockEmployee.avatarUrl}
        period={mockEmployee.reportingPeriod}
      />

      <main className="px-5 pt-6 space-y-6 max-w-2xl mx-auto">
        {/* Sales performance */}
        <section className="bg-surface-container-low rounded-xl p-6 editorial-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              {planAchievement >= 100 ? 'Over Target' : 'In Progress'}
            </span>
          </div>

          <div className="mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-outline">Sales Performance</span>
          </div>
          <div className="flex flex-col gap-1 mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-extrabold tracking-tighter">{formatPercent(planAchievement)}</span>
              <span className="text-secondary font-bold text-lg">
                <span className="material-symbols-outlined align-middle text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              </span>
            </div>
            <p className="text-sm text-on-surface-variant">Achievement vs. Target</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Revenue expandable */}
            <div className="bg-surface-container-lowest rounded-lg overflow-hidden transition-all duration-300">
              <div className="flex flex-col p-4 cursor-pointer" onClick={() => setRevenueExpanded(!revenueExpanded)}>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-semibold text-outline uppercase tracking-wider mb-1">Actual Revenue</span>
                  <span className={`material-symbols-outlined text-outline text-lg transition-transform duration-300 ${revenueExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                </div>
                <span className="text-xl font-bold text-blue-900">
                  {formatCurrency(actualRevenue, '')} <span className="text-xs font-medium">{mockSalary.currency}</span>
                </span>
              </div>
              {revenueExpanded && (
                <div className="p-4 space-y-3 border-t border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase">Orders Total</span>
                    <span className="text-xs font-bold">{formatCurrency(ordersTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase">Returns Total</span>
                    <span className="text-xs font-bold text-error">{formatCurrency(returnsTotal)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Plan / Overplan */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col">
                <span className="text-[10px] font-semibold text-outline uppercase tracking-wider mb-1">Plan</span>
                <span className="text-sm font-bold text-on-surface">
                  {formatCurrency(salesPlan, '')} <span className="text-[10px]">{mockSalary.currency}</span>
                </span>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col border-l-4 border-secondary">
                <span className="text-[10px] font-semibold text-outline uppercase tracking-wider mb-1">Overplan</span>
                <span className="text-sm font-bold text-secondary">+{formatCurrency(overplan, '')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ACB + Bonuses grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-surface-container-low rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-outline">ACB Achievement</span>
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-fixed-variant text-lg">groups</span>
                </div>
              </div>
              <span className="text-3xl font-extrabold">{formatPercent(acb.achievement)}</span>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-end">
                <div><p className="text-[10px] uppercase">Actual</p><p className="text-lg font-bold">{acb.actual}</p></div>
                <div className="text-right"><p className="text-[10px] uppercase">Plan</p><p className="text-sm font-medium">{acb.plan}</p></div>
              </div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-low rounded-xl p-5 border-2 border-tertiary-fixed-dim/20 relative">
            <div className="absolute -top-3 -right-2 transform rotate-12">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
            </div>
            <span className="text-[11px] uppercase tracking-widest text-outline block mb-4">Bonuses Unlocked</span>
            <h3 className="text-lg font-bold leading-tight mb-4 text-primary">
              {overachievementSteps.completed} Overachievement Steps Completed!
            </h3>
            <div className="flex justify-between items-center gap-2 mt-2">
              {Array.from({ length: overachievementSteps.completed }, (_, i) => (
                <div key={i} className="flex-1 h-12 bg-tertiary-fixed-dim rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              ))}
              {Array.from({ length: overachievementSteps.total - overachievementSteps.completed }, (_, i) => (
                <div key={i} className="flex-1 h-12 bg-surface-container-high rounded-lg flex items-center justify-center border-2 border-dashed border-outline-variant">
                  <span className="material-symbols-outlined text-outline">lock</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
