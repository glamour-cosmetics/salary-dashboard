import { useT } from '../../i18n/useT'
import ProductItem from './ProductItem'

export default function ProductList({ products, promoProducts, currency }) {
    const t = useT('orderDetail')
    return (
        <section className="space-y-6">
            {products.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-on-surface">{t.manifest}</h3>
                        <span className="text-outline text-xs font-medium uppercase tracking-widest">
                            {t.items.replace('{{n}}', products.length)}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {products.map((p, i) => (
                            <ProductItem key={i} name={p.name} code={p.code} quantity={p.quantity} amount={p.amount} imageUrl={p.imageUrl} />
                        ))}
                    </div>
                </div>
            )}

            {promoProducts.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-on-surface">{t.promo}</h3>
                        <span className="text-outline text-xs font-medium uppercase tracking-widest">
                            {t.items.replace('{{n}}', promoProducts.length)}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {promoProducts.map((p, i) => (
                            <ProductItem key={i} name={p.name} code={p.code} quantity={p.quantity} amount={0} imageUrl={p.imageUrl} isFree />
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}
