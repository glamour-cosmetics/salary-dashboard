export default function TopBar({ title, subtitle, avatarUrl, period }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-xl flex justify-between items-center w-full px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
          <img alt="User" className="w-full h-full object-cover" src={avatarUrl} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-blue-900">{title}</span>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">{subtitle}</span>
        </div>
      </div>
      <div className="text-[10px] uppercase tracking-widest font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full">
        {period}
      </div>
    </header>
  )
}
