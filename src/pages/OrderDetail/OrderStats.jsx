import { useT } from '../../i18n/useT'
import { useLanguage } from '../../context/LanguageContext'
import { formatCurrency } from '../../utils/formatters'

function formatDeliveryDate(dateStr, language) {
    if (!dateStr) return '—'
    const locale = language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US'
    return new Date(dateStr).toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function OrderStats({ totalAmount, discountAmount, deliveryNo, deliveryDate }) {
    const t = useT('orderDetail')
    const { language } = useLanguage()
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-6 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-outline">{t.totalAmount}</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">{formatCurrency(totalAmount, '').trim()}</span>
                </div>
                {discountAmount > 0 && (
                    <p className="text-[10px] text-error font-medium">-{formatCurrency(discountAmount, '').trim()} {t.discount}</p>
                )}
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-outline">{t.deliveryNo}</span>
                <div className="text-2xl font-bold text-on-surface">{deliveryNo}</div>
            </div>
            <div className="col-span-2 editorial-gradient p-8 rounded-xl text-white relative overflow-hidden">
                <div className="relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-white/70">{t.estimatedDelivery}</span>
                    <div className="text-2xl font-extrabold mt-1">{formatDeliveryDate(deliveryDate, language)}</div>
                </div>
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </div>
        </div>
    )
}
