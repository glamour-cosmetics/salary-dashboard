import { useT } from '../../i18n/useT'
import { formatCurrency } from '../../utils/formatters'

export default function OrderSummary({ subtotal, discount, total }) {
    const t = useT('orderDetail')
    return (
        <section className="bg-surface-container-low rounded-2xl p-6 space-y-4">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-outline">
                <span>{t.subtotal}</span>
                <span>{formatCurrency(subtotal, '').trim()}</span>
            </div>
            {discount > 0 && (
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-error">
                    <span>{t.discountLabel}</span>
                    <span>-{formatCurrency(discount, '').trim()}</span>
                </div>
            )}
            {/* <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-outline">
                <span>{t.shipping}</span>
                <span className="text-secondary font-extrabold">{t.calculated}</span>
            </div> */}
            <div className="h-px bg-outline-variant/20" />
            <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-on-surface">{t.totalBalance}</span>
                <span className="text-xl font-extrabold text-primary">{formatCurrency(total, '').trim()}</span>
            </div>
        </section>
    )
}
