import { useEffect, useState } from 'react'
import { getOrderDetail, getReturnDetail } from '../../services/api'
import { formatCurrency } from '../../utils/formatters'

function formatDatetime(str) {
    if (!str) return ''
    return new Date(str).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false,
    })
}

export default function TransactionDetail({ transaction, onClose }) {
    const [detail, setDetail] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const isReturn = transaction.type === 'return'

    useEffect(() => {
        const rawId = transaction.id.replace(/^(ord|ret)-/, '')
        const fetch = isReturn ? getReturnDetail : getOrderDetail
        fetch(rawId)
            .then(setDetail)
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [transaction.id])

    const items = detail?.items ?? detail?.products ?? []
    const totalAmount = detail?.total_amount ?? 0

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

            {/* Bottom sheet */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col">
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                    <div className="w-10 h-1 rounded-full bg-outline-variant" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-surface-container shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isReturn ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {isReturn ? 'assignment_return' : 'shopping_bag'}
                            </span>
                        </div>
                        <div>
                            <p className="font-bold text-on-surface text-sm leading-tight">{transaction.title}</p>
                            <p className="text-[10px] text-outline uppercase tracking-tighter">{transaction.subtitle}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined text-outline">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <span className="material-symbols-outlined animate-spin text-3xl text-outline">progress_activity</span>
                        </div>
                    ) : error ? (
                        <p className="text-center text-error text-sm py-8">Failed to load details</p>
                    ) : (
                        <>
                            {/* Status + date */}
                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${isReturn ? 'bg-outline/10 text-outline' : 'bg-secondary-container/30 text-on-secondary-container'}`}>
                                    {transaction.badge}
                                </span>
                                <span className="text-[11px] text-outline">{formatDatetime(detail?.deal_datetime ?? detail?.created_at)}</span>
                            </div>

                            {/* Products */}
                            {items.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Products</p>
                                    <div className="space-y-2">
                                        {items.map((item, i) => (
                                            <div key={i} className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-on-surface truncate">{item.product_name ?? item.name}</p>
                                                    <p className="text-[10px] text-outline mt-0.5">
                                                        {item.quantity ?? item.count ?? 1} × {formatCurrency(item.price ?? item.unit_price ?? 0, '')} UZS
                                                    </p>
                                                </div>
                                                <p className="shrink-0 text-sm font-bold text-on-surface">
                                                    {formatCurrency(item.total ?? item.amount ?? (item.price * item.quantity) ?? 0, '')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            <div className={`rounded-xl p-4 flex items-center justify-between ${isReturn ? 'bg-error/10' : 'bg-secondary/10'}`}>
                                <span className="text-sm font-bold uppercase tracking-wider text-on-surface">Total</span>
                                <span className={`text-lg font-extrabold tracking-tight ${isReturn ? 'text-error' : 'text-secondary'}`}>
                                    {isReturn ? '−' : '+'}{formatCurrency(totalAmount, '')} UZS
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
