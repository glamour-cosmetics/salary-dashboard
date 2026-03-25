import { useState, useEffect } from 'react'
import TopBar from '../../components/layout/TopBar/TopBar'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import Modal from '../../components/common/Modal/modal'
import { useAuth } from '../../context/AuthContext'
import { getDailySales } from '../../services/api'
import { formatCurrency } from '../../utils/formatters'
import MonthSelector from './MonthSelector'
import SalesCalendar from './SalesCalendar'
import DailySummary from './DailySummary'
import TransactionList from './TransactionList'
import TransactionDetail from './TransactionDetail'

function toDateStr(year, month, day) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatTime(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatStatus(status) {
    if (!status) return ''
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function mapTransactions(salesData) {
    if (!salesData) return []
    const orders = (salesData.orders ?? []).map(o => ({
        id: `ord-${o.id}`,
        icon: 'shopping_bag',
        iconBg: 'bg-secondary-container',
        iconColor: 'text-on-secondary-container',
        title: o.client_name ?? 'Order',
        subtitle: `#${o.delivery_number ?? o.id} • ${formatTime(o.deal_datetime)}`,
        badge: o.status_label?.en ?? o.status,
        badgeStyle: 'bg-secondary-container/30 text-on-secondary-container',
        amount: `+${formatCurrency(o.total_amount, '')}`,
        amountColor: 'text-secondary',
    }))
    const returns = (salesData.returns ?? []).map(r => ({
        id: `ret-${r.id}`,
        icon: 'assignment_return',
        iconBg: 'bg-error-container',
        iconColor: 'text-on-error-container',
        title: r.client_name ?? 'Return',
        subtitle: `#${r.delivery_number ?? r.id} • ${formatTime(r.deal_datetime)}`,
        badge: r.status_label?.en ?? r.status,
        badgeStyle: 'bg-outline/10 text-outline',
        amount: `-${formatCurrency(r.total_amount, '')}`,
        amountColor: 'text-error',
    }))
    return [...orders, ...returns]
}

export default function Sales() {
    const { employee, period, setPeriod, periodLabel, workplaceId } = useAuth()
    const [showModal, setShowModal] = useState(false)

    const today = new Date()
    const [calMonth, setCalMonth] = useState(today.getMonth() + 1)
    const [calYear, setCalYear] = useState(today.getFullYear())
    const [selectedDay, setSelectedDay] = useState(today.getDate())

    const [salesData, setSalesData] = useState(null)
    const [salesLoading, setSalesLoading] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState(null)

    const dateStr = toDateStr(calYear, calMonth, selectedDay)

    useEffect(() => {
        if (!workplaceId) return
        setSalesLoading(true)
        setSalesData(null)
        getDailySales(workplaceId, dateStr)
            .then(res => setSalesData(res.data ?? res))
            .catch(() => setSalesData(null))
            .finally(() => setSalesLoading(false))
    }, [workplaceId, dateStr])

    function prevMonth() {
        if (calMonth === 1) { setCalMonth(12); setCalYear(y => y - 1) }
        else setCalMonth(m => m - 1)
    }

    function nextMonth() {
        if (calMonth === 12) { setCalMonth(1); setCalYear(y => y + 1) }
        else setCalMonth(m => m + 1)
    }

    const transactions = mapTransactions(salesData)
    const ordersTotal = salesData?.orders_amount ?? 0
    const returnsTotal = salesData?.returns_amount ?? 0
    const netRevenue = salesData?.net_sales ?? 0

    const selectedDateLabel = new Date(calYear, calMonth - 1, selectedDay)
        .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    return (
        <div className="min-h-screen bg-surface pb-32">
            <TopBar
                title="Sales Journal"
                subtitle={employee?.name}
                avatarUrl={employee?.avatarUrl}
                period={periodLabel}
                onPeriodClick={() => setShowModal(true)}
            />

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                selectedMonth={period?.month}
                selectedYear={period?.year}
                onConfirm={(month, year) => setPeriod({ month, year })}
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
                            date={selectedDateLabel}
                            netRevenue={netRevenue}
                            totalOrders={ordersTotal}
                            totalReturns={returnsTotal}
                        />
                        {transactions.length > 0
                            ? <TransactionList transactions={transactions} onSelect={setSelectedTransaction} />
                            : <p className="text-center text-outline text-sm py-8">No transactions for this day</p>
                        }
                    </>
                ) : (
                    <p className="text-center text-outline text-sm py-8">No data available</p>
                )}
            </main>

            <BottomNav />

            {selectedTransaction && (
                <TransactionDetail
                    transaction={selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                />
            )}
        </div>
    )
}
