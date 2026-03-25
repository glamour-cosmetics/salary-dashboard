export default function DailySummary({ date, netRevenue, totalOrders, totalReturns, currency = 'UZS' }) {
    return (
        <section className="mb-8">
            {/* <div className="flex items-center gap-2 mb-6">
                <span className="text-sm font-bold text-primary px-3 py-1 bg-primary-fixed rounded-full">{date}</span>
            </div> */}
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-gradient-to-br from-primary-container to-primary p-6 rounded-xl text-on-primary">
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Daily Net Revenue</span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-bold tracking-tight">{netRevenue.toLocaleString()}</span>
                        <span className="text-sm font-medium opacity-80">{currency}</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-xl">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-outline">Total Orders</span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-bold text-on-surface">{totalOrders.toLocaleString()}</span>
                        <span className="text-[10px] font-medium text-outline">{currency}</span>
                    </div>
                </div>
                <div className="bg-surface-container-lowest p-4 rounded-xl">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-outline">Total Returns</span>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-bold text-error">{totalReturns.toLocaleString()}</span>
                        <span className="text-[10px] font-medium text-outline">{currency}</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
