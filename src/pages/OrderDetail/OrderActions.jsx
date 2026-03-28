import { useT } from '../../i18n/useT'

export default function OrderActions({ onContactSupport, onDownloadInvoice }) {
    const t = useT('orderDetail')
    return (
        <div className="flex flex-col gap-3 hidden">
            <button
                onClick={onContactSupport}
                className="w-full bg-primary-container text-white font-bold py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/10"
            >
                {t.contactSupport}
            </button>
            <button
                onClick={onDownloadInvoice}
                className="w-full bg-surface-container-high text-on-primary-fixed-variant font-bold py-4 rounded-xl hover:bg-surface-container-highest transition-colors"
            >
                {t.downloadInvoice}
            </button>
        </div>
    )
}
