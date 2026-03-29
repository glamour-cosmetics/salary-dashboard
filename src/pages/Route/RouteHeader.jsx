import { useT } from '../../i18n/useT'

export default function RouteHeader({ workplace, clientCount }) {
    const t = useT('route')
    return (
        <section className="mt-4 mb-6">
            <div className="flex items-end justify-between">
                <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase">{t.workplace}</span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">{workplace}</h2>
                </div>
                <div className="bg-primary-container px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-white">{t.clients.replace('{{n}}', clientCount)}</span>
                </div>
            </div>
        </section>
    )
}
