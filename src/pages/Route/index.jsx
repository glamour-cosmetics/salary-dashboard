import { useState, useEffect, useCallback } from 'react'
import TopBar from '../../components/layout/TopBar/TopBar'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import { useAuth } from '../../context/AuthContext'
import { useT } from '../../i18n/useT'
import { getRouteClients } from '../../services/api'
import RouteHeader from './RouteHeader'
import FilterBar from './FilterBar'
import SortBar from './SortBar'
import ClientCard from './ClientCard'

// Weekday chip name → API weekday index (0=Mon … 6=Sun)
const DAY_TO_NUM = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6 }
// API weekday index → single-letter label for visit day dots (0=Mon … 6=Sun)
const NUM_TO_LABEL = { 0: 'M', 1: 'T', 2: 'W', 3: 'T', 4: 'F', 5: 'S', 6: 'S' }

const WEEKDAY_CHIPS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

function todayChip() {
    const d = new Date().getDay()
    return WEEKDAY_CHIPS[(d + 6) % 7]
}

function formatDate(d = new Date()) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function collectVisitDays(client, selectedNum) {
    const all = new Set()
    for (const key of ['first_week', 'second_week', 'third_week', 'fourth_week', 'fifth_week']) {
        for (const n of client[key] ?? []) all.add(n)
    }
    return [...all].sort((a, b) => a - b).map(n => ({
        label: NUM_TO_LABEL[n] ?? String(n),
        active: n === selectedNum,
    }))
}

function mapClient(raw, selectedNum) {
    return {
        id: raw.person_id,
        name: raw.name,
        address: raw.address,
        phone: raw.phone_number,
        location: raw.location,
        thisMonth: parseFloat(raw.current_month_net_sales) || 0,
        avgOrder: parseFloat(raw.avg_monthly_net_sales) || 0,
        plan: parseFloat(raw.sales_plan) || 0,
        visitDays: collectVisitDays(raw, selectedNum),
        lastOrderDays: raw.days_since_last_order ?? 0,
    }
}

export default function Route() {
    const { employee } = useAuth()
    const t = useT('route')

    const [activeDay, setActiveDay] = useState(todayChip)
    const [likelyToOrder] = useState(false)
    const [sortBy, setSortBy] = useState('days_since_last_order')
    const [sortDir, setSortDir] = useState('Desc')

    const [clients, setClients] = useState([])
    const [workplaceName, setWorkplaceName] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState(null)

    // Reset and load page 1 when filters change
    useEffect(() => {
        setLoading(true)
        setError(null)
        setClients([])
        setPage(1)
        const weekday = DAY_TO_NUM[activeDay]
        getRouteClients({ weekday, likelyToOrder, page: 1 })
            .then(res => {
                setWorkplaceName(res.workplace_name ?? '')
                setTotalPages(res.total_pages ?? 1)
                setTotalCount(res.count ?? res.total_count ?? 0)
                setClients((res.data ?? []).map(c => mapClient(c, weekday)))
            })
            .catch(err => setError(err.message ?? 'Failed to load clients'))
            .finally(() => setLoading(false))
    }, [activeDay, likelyToOrder])

    function loadMore() {
        const nextPage = page + 1
        const weekday = DAY_TO_NUM[activeDay]
        setLoadingMore(true)
        getRouteClients({ weekday, likelyToOrder, page: nextPage })
            .then(res => {
                setPage(nextPage)
                setClients(prev => [...prev, ...(res.data ?? []).map(c => mapClient(c, weekday))])
            })
            .catch(err => setError(err.message ?? 'Failed to load more'))
            .finally(() => setLoadingMore(false))
    }

    const sorted = [...clients].sort((a, b) => {
        let diff = 0
        if (sortBy === 'days_since_last_order') diff = a.lastOrderDays - b.lastOrderDays
        else if (sortBy === 'avg_monthly_net_sales') diff = a.avgOrder - b.avgOrder
        return sortDir === 'Desc' ? -diff : diff
    })

    const hasMore = page < totalPages

    return (
        <div className="min-h-screen bg-surface pb-32">
            <TopBar
                title={t.title}
                subtitle={employee?.name}
                avatarUrl={employee?.avatarUrl}
            />

            <main className="pt-4 px-4 max-w-2xl mx-auto">
                <RouteHeader
                    workplace={workplaceName}
                    clientCount={totalCount}
                />

                <FilterBar
                    date={formatDate()}
                    likelyToOrder={likelyToOrder}
                    onToggleLikely={() => {}}
                    activeDay={activeDay}
                    onDaySelect={setActiveDay}
                />

                {!loading && !error && clients.length > 0 && (
                    <SortBar
                        sortBy={sortBy}
                        sortDir={sortDir}
                        onSortChange={setSortBy}
                        onDirToggle={() => setSortDir(d => d === 'Desc' ? 'Asc' : 'Desc')}
                    />
                )}

                {loading ? (
                    <div className="flex items-center justify-center h-40 text-on-surface-variant">
                        <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
                    </div>
                ) : error ? (
                    <p className="text-center text-error text-sm py-8">{error}</p>
                ) : sorted.length === 0 ? (
                    <p className="text-center text-outline text-sm py-8">{t.noClients}</p>
                ) : (
                    <>
                        <div className="space-y-6">
                            {sorted.map(client => (
                                <ClientCard key={client.id} client={client} />
                            ))}
                        </div>

                        {hasMore && (
                            <div className="flex justify-center pt-6 pb-2">
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-bold tracking-wide active:scale-95 transition-transform disabled:opacity-50"
                                >
                                    {loadingMore
                                        ? <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                                        : <span className="material-symbols-outlined text-base">expand_more</span>
                                    }
                                    {t.loadMore} ({page}/{totalPages})
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <BottomNav />
        </div>
    )
}
