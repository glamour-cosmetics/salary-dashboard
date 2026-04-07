import { useState } from 'react'
import TopBar from '../../components/layout/TopBar/TopBar'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import Modal from '../../components/common/Modal/modal'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { useT } from '../../i18n/useT'

function KpiItemCard({ item, currency, t }) {
  const pct = Math.min(item.achievement, 100)
  const achieved = item.achievement >= item.config.threshold
  return (
    <div className="bg-white rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-bold text-on-surface leading-tight">{item.name}</span>
        <span className={`shrink-0 text-sm font-extrabold ${achieved ? 'text-secondary' : 'text-primary'}`}>
          {formatPercent(item.achievement)}
        </span>
      </div>

      <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${achieved ? 'bg-secondary' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-outline mb-0.5">{t.plan}</p>
          <p className="text-xs font-bold text-on-surface">{formatCurrency(item.plan, '')}</p>
          <p className="text-[9px] text-outline">{currency}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider text-outline mb-0.5">{t.actual}</p>
          <p className="text-xs font-bold text-on-surface">{formatCurrency(item.actual, '')}</p>
          <p className="text-[9px] text-outline">{currency}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider text-outline mb-0.5">{t.bonusEarned}</p>
          <p className={`text-xs font-bold ${item.bonus > 0 ? 'text-secondary' : 'text-outline'}`}>
            {formatCurrency(item.bonus, '')}
          </p>
          <p className="text-[9px] text-outline">{currency}</p>
        </div>
      </div>

      <div className="flex gap-3 pt-1 border-t border-surface-container-high">
        <span className="text-[9px] text-outline">
          {t.threshold}: <span className="font-bold text-on-surface-variant">{item.config.threshold}%</span>
        </span>
        <span className="text-[9px] text-outline">
          {t.bonusPool}: <span className="font-bold text-on-surface-variant">{formatCurrency(item.config.bonusPool, '')} {currency}</span>
        </span>
      </div>
    </div>
  )
}

export default function KPI() {
  const { employee, period, setPeriod, periodLabel, dashboardData, dashboardLoading } = useAuth()
  const t = useT('kpi')
  const [revenueExpanded, setRevenueExpanded] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const kpi = dashboardData?.kpi
  const brandKpi = dashboardData?.brandKpi
  const productKpi = dashboardData?.productKpi
  const currency = dashboardData?.salary?.currency ?? 'UZS'
  return (
    <div className="min-h-screen bg-surface pb-32">
      <TopBar
        title={t.title}
        subtitle={employee?.name}
        avatarUrl={employee?.avatarUrl}
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
        <main className="px-5 pt-6 space-y-6 max-w-2xl mx-auto">

          {/* Sales performance */}
          <section className="bg-surface-container-low rounded-xl p-6 editorial-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                {kpi.planAchievement >= 100 ? t.overTarget : t.inProgress}
              </span>
            </div>

            <div className="mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-outline">{t.salesPerformance}</span>
            </div>
            <div className="flex flex-col gap-1 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-extrabold tracking-tighter">{formatPercent(kpi.planAchievement)}</span>
                <span className="text-secondary font-bold text-lg">
                  <span className="material-symbols-outlined align-middle text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                </span>
              </div>
              <p className="text-sm text-on-surface-variant">{t.achievementVsTarget}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Revenue expandable */}
              <div className="bg-surface-container-lowest rounded-lg overflow-hidden">
                <div className="flex flex-col p-4 cursor-pointer" onClick={() => setRevenueExpanded(!revenueExpanded)}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-semibold text-outline uppercase tracking-wider mb-1">{t.actualRevenue}</span>
                    <span className={`material-symbols-outlined text-outline text-lg transition-transform duration-300 ${revenueExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                  </div>
                  <span className="text-xl font-bold text-blue-900">
                    {formatCurrency(kpi.sales.actual, '')} <span className="text-xs font-medium">{currency}</span>
                  </span>
                </div>
                {revenueExpanded && (
                  <div className="p-4 space-y-3 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase">{t.ordersTotal}</span>
                      <span className="text-xs font-bold">{formatCurrency(kpi.ordersTotal, '')} {currency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase">{t.returnsTotal}</span>
                      <span className="text-xs font-bold text-error">{formatCurrency(kpi.returnsTotal, '')} {currency}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Plan / Overplan */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col">
                  <span className="text-[10px] font-semibold text-outline uppercase tracking-wider mb-1">{t.plan}</span>
                  <span className="text-sm font-bold text-on-surface">
                    {formatCurrency(kpi.sales.plan, '')} <span className="text-[10px]">{currency}</span>
                  </span>
                </div>
                <div className={`bg-surface-container-lowest p-3 rounded-lg flex flex-col border-l-4 ${kpi.overplan > 0 ? 'border-secondary' : 'border-red-500'}`}>
                  <span className="text-[10px] font-semibold text-outline uppercase tracking-wider mb-1">{kpi.overplan > 0 ? t.overplan : t.shortage}</span>
                  <span className={`text-sm font-bold ${kpi.overplan > 0 ? 'text-secondary' : 'text-error'}`}>
                    {kpi.overplan > 0 ? `+${formatCurrency(kpi.overplan, '')}` : `-${formatCurrency(kpi.sales.plan - kpi.sales.actual, '')}`}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ACB + Bonuses grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="bg-white rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-outline">{t.acbAchievement}</span>
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-fixed-variant text-lg">groups</span>
                  </div>
                </div>
                <span className="text-3xl font-extrabold">{formatPercent(kpi.acb.achievement)}</span>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-end">
                  <div><p className="text-[10px] uppercase">{t.actual}</p><p className="text-lg font-bold">{kpi.acb.actual}</p></div>
                  <div className="text-right"><p className="text-[10px] uppercase">{t.plan}</p><p className="text-sm font-medium">{kpi.acb.plan}</p></div>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{ width: `${Math.min(kpi.acb.achievement, 100)}%` }}
                  />
                </div>
              </div>
            </section>


            {/* Brand KPI */}
            {brandKpi?.items?.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-outline">{t.brandKpi}</span>
                  {brandKpi.totalBonus > 0 && (
                    <span className="text-xs font-bold text-secondary">{formatCurrency(brandKpi.totalBonus)}</span>
                  )}
                </div>
                <div className="space-y-3">
                  {brandKpi.items.map(item => (
                    <KpiItemCard key={item.id} item={item} currency={currency} t={t} />
                  ))}
                </div>
              </section>
            )}

            {/* Product KPI */}
            {productKpi?.items?.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-outline">{t.productKpi}</span>
                  {productKpi.totalBonus > 0 && (
                    <span className="text-xs font-bold text-secondary">{formatCurrency(productKpi.totalBonus)}</span>
                  )}
                </div>
                <div className="space-y-3">
                  {productKpi.items.map(item => (
                    <KpiItemCard key={item.id} item={item} currency={currency} t={t} />
                  ))}
                </div>
              </section>
            )}

            <section className="bg-surface-container-low rounded-xl p-5 border-2 border-tertiary-fixed-dim/20 relative">
              <div className="absolute -top-3 -right-2 transform rotate-12">
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              </div>
              <span className="text-[11px] uppercase tracking-widest text-outline block mb-4">{t.bonusesUnlocked}</span>
              <h3 className="text-lg font-bold leading-tight mb-4 text-primary">
                {kpi.overachievementSteps.completed === 0
                  ? t.noSteps
                  : (kpi.overachievementSteps.completed > 1 ? t.stepsCompletedPlural : t.stepsCompleted).replace('{{n}}', kpi.overachievementSteps.completed)}
              </h3>
              <div className="flex justify-between items-center gap-2 mt-2">
                {Array.from({ length: kpi.overachievementSteps.completed }, (_, i) => (
                  <div key={i} className="flex-1 h-12 bg-tertiary-fixed-dim rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                ))}
                {Array.from({ length: kpi.overachievementSteps.total - kpi.overachievementSteps.completed }, (_, i) => (
                  <div key={i} className="flex-1 h-12 bg-surface-container-high rounded-lg flex items-center justify-center border-2 border-dashed border-outline-variant">
                    <span className="material-symbols-outlined text-outline">lock</span>
                  </div>
                ))}
              </div>
              {kpi.overachievementSteps.salesGap > 0 && (
                <p className="text-[10px] text-outline mt-4 text-center">
                  {t.toNextBonus.replace('{{amount}}', `${formatCurrency(kpi.overachievementSteps.salesGap, '')} ${currency}`)}
                </p>
              )}
            </section>
          </div>
        </main>
      )}

      <BottomNav />
    </div>
  )
}
