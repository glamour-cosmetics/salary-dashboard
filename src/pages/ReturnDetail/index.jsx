import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar/TopBar'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import { useLanguage } from '../../context/LanguageContext'
import { useT } from '../../i18n/useT'
import { getReturnDetail } from '../../services/api'
import ProductList from '../OrderDetail/ProductList'
import { formatCurrency } from '../../utils/formatters'

function formatDate(str, language) {
    if (!str) return '—'
    const locale = language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US'
    return new Date(str).toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })
}

function mapProduct(p) {
    return {
        name: p.product_name ?? p.name,
        code: p.product_code ?? null,
        quantity: p.quantity ?? p.count ?? 1,
        amount: p.total ?? p.amount ?? (p.price ?? p.unit_price ?? 0) * (p.quantity ?? p.count ?? 1),
        imageUrl: p.photo_url ?? null,
    }
}

export default function ReturnDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { language } = useLanguage()
    const t = useT('returnDetail')

    const [ret, setRet] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        getReturnDetail(id)
            .then(data => setRet(data))
            .catch(err => setError(err.message ?? 'Failed to load return'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return (
        <div className="min-h-screen bg-surface flex items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-4xl text-outline">progress_activity</span>
        </div>
    )

    if (error) return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-6">
            <p className="text-center text-error text-sm">{error}</p>
        </div>
    )

    const products = (ret.items ?? ret.products ?? []).map(mapProduct)
    const statusLabel = ret.status_label?.[language] ?? ret.status
    const returnDate = ret.deal_datetime ?? ret.created_at

    return (
        <div className="min-h-screen bg-surface pb-32">
            <TopBar title={t.title} onBack={() => navigate(-1)} />

            <main className="pt-24 pb-12 px-6 max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <section className="space-y-2">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-outline">{t.returnId}</span>
                            <h2 className="text-2xl font-extrabold -tracking-[0.02em] text-on-surface">{ret.delivery_number ?? ret.id}</h2>
                        </div>
                        {statusLabel && (
                            <div className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-error-container text-on-error-container">
                                {statusLabel}
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-on-surface-variant">{t.client}: {ret.client_name ?? ret.client?.name}</p>
                </section>

                {/* Return date */}
                <div className="bg-error/10 p-6 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-outline">{t.returnDate}</span>
                    <div className="text-xl font-extrabold text-error">{formatDate(returnDate, language)}</div>
                </div>

                {/* Products */}
                <ProductList products={products} promoProducts={[]} />

                {/* Total */}
                <section className="bg-error-container rounded-2xl p-6 flex justify-between items-baseline">
                    <span className="text-sm font-bold uppercase tracking-widest text-on-error-container">{t.totalReturned}</span>
                    <span className="text-xl font-extrabold text-error">−{formatCurrency(ret.total_amount, '').trim()}</span>
                </section>
            </main>

            <BottomNav />
        </div>
    )
}
