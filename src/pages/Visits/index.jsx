import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar/TopBar'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { useT } from '../../i18n/useT'
import { getVisitSummary, getVisitList, getRouteClients } from '../../services/api'
import VisitSummaryCard from './VisitSummaryCard'
import VisitItem from './VisitItem'

function toISODate(d = new Date()) {
    return d.toISOString().slice(0, 10)
}

// YYYY-MM-DD → route API weekday (0=Mon … 6=Sun)
function dateToWeekday(iso) {
    const [y, m, d] = iso.split('-').map(Number)
    return (new Date(y, m - 1, d).getDay() + 6) % 7
}

const TZ = 'Asia/Tashkent'
const LOCALE_MAP = { ru: 'ru-RU', uz: 'uz-UZ', en: 'en-US' }

// "04:22:53" (UTC) → "09:22" in Asia/Tashkent (+5h)
function fmtUTCtoTashkent(t) {
    if (!t) return null
    const [h, m] = t.split(':').map(Number)
    const totalMin = (h * 60 + m + 5 * 60) % (24 * 60)
    const hh = String(Math.floor(totalMin / 60)).padStart(2, '0')
    const mm = String(totalMin % 60).padStart(2, '0')
    return `${hh}:${mm}`
}

// ISO datetime string → "19:24" in Asia/Tashkent
function fmtISOTime(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleTimeString('en-US', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false })
}

// seconds → "5m 22s", "45s", "1h 3m"
function fmtDuration(sec) {
    if (!sec) return '—'
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`
    if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`
    return `${s}s`
}

function formatDate(iso, locale = 'en-US') {
    const [y, m, d] = iso.split('-')
    return new Date(y, m - 1, d).toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })
}

function mapSummary(raw, locale) {
    return {
        workplace: raw.workplace ?? '',
        date: formatDate(raw.visit_date, locale),
        visitsDone: raw.planned_visits ?? 0,   // planned visits completed
        visitsPlan: 0,                          // filled in after route count fetch
        firstVisitTime: fmtUTCtoTashkent(raw.first_visit_by_plan),
        lastVisitTime: fmtUTCtoTashkent(raw.last_visit_by_plan),
        avgVisitTime: raw.average_spent_time_text ?? null,
        salesManagerId: raw.sales_manager_id ?? null,
    }
}

function mapVisit(raw) {
    return {
        id: raw.id,
        clientName: raw.client_name ?? raw.client_id,
        status: raw.is_successful ? 'successful' : 'unsuccessful',
        isPlanned: raw.is_planned ?? false,
        timeFrom: fmtISOTime(raw.started_at),
        timeTo: fmtISOTime(raw.finished_at),
        duration: fmtDuration(raw.duration),
        type: raw.is_planned ? 'planned' : 'unplanned',
    }
}

export default function Visits() {
    const { employee } = useAuth()
    const { language } = useLanguage()
    const t = useT('visits')
    const { state } = useLocation()
    const locale = LOCALE_MAP[language] ?? 'en-US'

    const [date] = useState(() => state?.date ?? toISODate())
    const [summary, setSummary] = useState(null)
    const [visits, setVisits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        setError(null)
        setSummary(null)
        setVisits([])

        const weekday = dateToWeekday(date)

        Promise.all([
            getVisitSummary(date),
            getRouteClients({ weekday, page: 1 }).then(res => res.count ?? res.total_count ?? 0).catch(() => 0),
        ])
            .then(async ([raw, routeCount]) => {
                if (!raw) return
                const mapped = mapSummary(raw, locale)
                mapped.visitsPlan = routeCount
                setSummary(mapped)
                if (mapped.salesManagerId) {
                    const items = await getVisitList(mapped.salesManagerId, date)
                    setVisits(items.map(mapVisit))
                }
            })
            .catch(err => setError(err.message ?? t.failedToLoad))
            .finally(() => setLoading(false))
    }, [date])

    const summaryData = summary ?? {
        workplace: '',
        date: formatDate(date, locale),
        visitsDone: 0,
        visitsPlan: 0,
        firstVisitTime: null,
        lastVisitTime: null,
        avgVisitTime: null,
    }

    return (
        <div className="min-h-screen bg-surface pb-32">
            <TopBar
                title={t.title}
                subtitle={employee?.name}
                avatarUrl={employee?.avatarUrl}
            />

            <main className="pt-4 px-4 max-w-2xl mx-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-40 text-on-surface-variant">
                        <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
                    </div>
                ) : error ? (
                    <p className="text-center text-error text-sm py-8">{error}</p>
                ) : (
                    <>
                        <VisitSummaryCard summary={summaryData} t={t} />

                        <section>
                            <h3 className="font-bold text-on-surface text-base mb-4">{t.timeline}</h3>

                            {visits.length === 0 ? (
                                <p className="text-center text-outline text-sm py-8">{t.noVisits}</p>
                            ) : (
                                <div className="space-y-4">
                                    {visits.map(visit => (
                                        <VisitItem key={visit.id} visit={visit} t={t} />
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>

            <BottomNav />
        </div>
    )
}
