import { useT } from '../../i18n/useT'

export default function OrderHeader({ orderId, status, clientName, statusStyle }) {
    const t = useT('orderDetail')
    return (
        <section className="space-y-2">
            <div className="flex justify-between items-end">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-outline">{t.orderId}</span>
                    <h2 className="text-2xl font-extrabold -tracking-[0.02em] text-on-surface">{orderId}</h2>
                </div>
                <div className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${statusStyle}`}>
                    {status}
                </div>
            </div>
            <p className="text-sm text-on-surface-variant">{t.client}: {clientName}</p>
        </section>
    )
}
