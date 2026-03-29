import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar/TopBar'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import { useLanguage } from '../../context/LanguageContext'
import { useT } from '../../i18n/useT'
import { getOrderDetail } from '../../services/api'
import OrderHeader from './OrderHeader'
import OrderStats from './OrderStats'
import ProductList from './ProductList'
import OrderSummary from './OrderSummary'
import OrderActions from './OrderActions'

const STATUS_STYLES = {
    'D':   'bg-surface-container-high text-outline',
    'B#N': 'bg-secondary-container text-on-secondary-container',
    'B#E': 'bg-tertiary-container text-on-tertiary-container',
    'B#W': 'bg-primary-container text-on-primary-container',
    'B#S': 'bg-secondary text-on-secondary',
    'B#V': 'bg-primary text-on-primary',
    'A':   'bg-surface-container-high text-outline',
    'C':   'bg-error-container text-on-error-container',
}

function mapProduct(p) {
    return {
        name: p.product_name,
        code: p.product_code ?? null,
        quantity: p.quantity,
        amount: p.amount ?? 0,
        imageUrl: p.photo_url ?? null,
    }
}

export default function OrderDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { language } = useLanguage()
    const t = useT('orderDetail')

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        getOrderDetail(id)
            .then(data => setOrder(data))
            .catch(err => setError(err.message ?? 'Failed to load order'))
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

    const products = (order.products ?? []).map(mapProduct)
    const promoProducts = (order.promo_products ?? []).map(mapProduct)
    const statusLabel = order.status_label?.[language] ?? order.status
    const statusStyle = STATUS_STYLES[order.status] ?? 'bg-surface-container-high text-outline'

    return (
        <div className="min-h-screen bg-surface pb-32">
            <TopBar title={t.title} onBack={() => navigate(-1)} />

            <main className="pt-24 pb-12 px-6 max-w-2xl mx-auto space-y-8">
                <OrderHeader
                    orderId={order.id}
                    status={statusLabel}
                    statusStyle={statusStyle}
                    clientName={order.client?.name}
                />
                <OrderStats
                    totalAmount={order.total_amount}
                    discountAmount={order.total_discount_amount}
                    deliveryNo={order.delivery_number}
                    deliveryDate={order.delivery_date}
                />
                <ProductList products={products} promoProducts={promoProducts} />
                <OrderSummary
                    subtotal={order.total_amount + (order.total_discount_amount ?? 0)}
                    discount={order.total_discount_amount}
                    total={order.total_amount}
                />
                <OrderActions />
            </main>

            <BottomNav />
        </div>
    )
}
