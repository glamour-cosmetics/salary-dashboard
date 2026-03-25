function TransactionItem({ tx, onSelect }) {
    const { icon, iconBg, iconColor, title, subtitle, badge, badgeStyle, amount, amountColor } = tx
    return (
        <button
            onClick={() => onSelect(tx)}
            className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl flex items-center gap-3 active:scale-[0.98] hover:bg-surface-container-low transition-all text-left"
        >
            <div className={`shrink-0 w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-on-surface truncate leading-tight">{title}</p>
                <p className="text-[10px] text-outline font-bold uppercase tracking-tighter mt-0.5 truncate">{subtitle}</p>
                <span className={`inline-block px-1.5 py-0.5 mt-1 text-[8px] font-bold uppercase tracking-wider rounded-md ${badgeStyle}`}>{badge}</span>
            </div>
            <div className="shrink-0 flex items-center gap-1">
                <p className={`text-sm font-bold tracking-tight ${amountColor}`}>{amount}</p>
                <span className="material-symbols-outlined text-outline text-[16px]">chevron_right</span>
            </div>
        </button>
    )
}

export default function TransactionList({ transactions, onSelect }) {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-label-md font-bold uppercase tracking-widest text-outline">Transactions</h3>
                <span className="text-xs text-on-primary-fixed-variant font-medium">{transactions.length} total</span>
            </div>
            <div className="space-y-2">
                {transactions.map((tx) => (
                    <TransactionItem key={tx.id} tx={tx} onSelect={onSelect} />
                ))}
            </div>
        </section>
    )
}
