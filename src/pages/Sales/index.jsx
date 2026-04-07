import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar/TopBar'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { useT } from '../../i18n/useT'
import { getDailySales, getVisitSummary } from '../../services/api'
import { formatCurrency } from '../../utils/formatters'
import MonthSelector from './MonthSelector'
import SalesCalendar from './SalesCalendar'
import DailySummary from './DailySummary'
import TransactionList from './TransactionList'

function toDateStr(year, month, day) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatTime(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function mapTransactions(salesData, lang, t) {
    if (!salesData) return []
    const orders = (salesData.orders ?? []).map(o => ({
        id: `ord-${o.id}`,
        rawId: o.id,
        type: 'order',
        icon: 'shopping_bag',
        iconBg: 'bg-secondary-container',
        iconColor: 'text-on-secondary-container',
        title: o.client_name ?? t.orderFallback,
        subtitle: `#${o.delivery_number ?? o.id} • ${formatTime(o.deal_datetime)}`,
        badge: o.status_label?.[lang] ?? o.status,
        badgeStyle: 'bg-secondary-container/30 text-on-secondary-container',
        amount: `+${formatCurrency(o.total_amount)}`,
        amountColor: 'text-secondary',
    }))
    const returns = (salesData.returns ?? []).map(r => ({
        id: `ret-${r.id}`,
        rawId: r.id,
        type: 'return',
        icon: 'assignment_return',
        iconBg: 'bg-error-container',
        iconColor: 'text-on-error-container',
        title: r.client_name ?? t.returnFallback,
        subtitle: `#${r.delivery_number ?? r.id} • ${formatTime(r.deal_datetime)}`,
        badge: r.status_label?.[lang] ?? r.status,
        badgeStyle: 'bg-outline/10 text-outline',
        amount: `-${formatCurrency(r.total_amount)}`,
        amountColor: 'text-error',
    }))
    return [...orders, ...returns]
}

export default function Sales() {
    const { employee, workplaceId } = useAuth()
    const { language } = useLanguage()
    const t = useT('sales')
    const navigate = useNavigate()
    const today = new Date()
    const [calMonth, setCalMonth] = useState(today.getMonth() + 1)
    const [calYear, setCalYear] = useState(today.getFullYear())
    const [selectedDay, setSelectedDay] = useState(today.getDate())

    const [salesData, setSalesData] = useState(null)
    const [visitData, setVisitData] = useState(null)
    const [salesLoading, setSalesLoading] = useState(false)

    function handleSelect(tx) {
        if (tx.type === 'order') navigate(`/order/${tx.rawId}`)
        else navigate(`/return/${tx.rawId}`)
    }

    const dateStr = toDateStr(calYear, calMonth, selectedDay)

    useEffect(() => {
        if (!workplaceId) return
        setSalesLoading(true)
        setSalesData(null)
        setVisitData(null)
        Promise.all([
            getDailySales(workplaceId, dateStr).then(res => res.data ?? res).catch(() => null),
            getVisitSummary(dateStr).catch(() => null),
        ]).then(([sales, visit]) => {
            setSalesData(sales)
            setVisitData(visit)
        }).finally(() => setSalesLoading(false))
    }, [workplaceId, dateStr])

    function prevMonth() {
        if (calMonth === 1) { setCalMonth(12); setCalYear(y => y - 1) }
        else setCalMonth(m => m - 1)
    }

    function nextMonth() {
        if (calMonth === 12) { setCalMonth(1); setCalYear(y => y + 1) }
        else setCalMonth(m => m + 1)
    }

    const transactions = mapTransactions(salesData, language, t)
    const ordersTotal = salesData?.orders_amount ?? 0
    const returnsTotal = salesData?.returns_amount ?? 0
    const netRevenue = salesData?.net_sales ?? 0
    const dailyPlan = salesData?.daily_sales_plan ?? 0
    const dailyAchievement = salesData?.daily_plan_achievement ?? 0

    return (
        <div className="min-h-screen bg-surface pb-32">
            <TopBar
                title={t.title}
                subtitle={employee?.name}
                avatarUrl={employee?.avatarUrl}
            />

            <main className="pt-4 pb-24 px-4 max-w-lg mx-auto">
                <section className="mb-6">
                    <MonthSelector month={calMonth} year={calYear} onPrev={prevMonth} onNext={nextMonth} />
                </section>

                <SalesCalendar
                    year={calYear}
                    month={calMonth}
                    selectedDay={selectedDay}
                    onDaySelect={setSelectedDay}
                    onPrevMonth={prevMonth}
                    onNextMonth={nextMonth}
                />

                {salesLoading ? (
                    <div className="flex items-center justify-center h-40 text-on-surface-variant">
                        <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
                    </div>
                ) : salesData ? (
                    <>
                        <DailySummary
                            date={dateStr}
                            netRevenue={netRevenue}
                            totalOrders={ordersTotal}
                            totalReturns={returnsTotal}
                            dailyPlan={dailyPlan}
                            dailyAchievement={dailyAchievement}
                            firstVisit={visitData?.first_visit_by_plan ?? null}
                            lastVisit={visitData?.last_visit_by_plan ?? null}
                            onViewVisits={() => navigate('/visits', { state: { date: dateStr } })}
                        />
                        {transactions.length > 0
                            ? <TransactionList transactions={transactions} onSelect={handleSelect} />
                            : <p className="text-center text-outline text-sm py-8">{t.noTransactions}</p>
                        }
                    </>
                ) : (
                    <p className="text-center text-outline text-sm py-8">{t.noData}</p>
                )}
            </main>

            <BottomNav />
        </div>
    )
}
