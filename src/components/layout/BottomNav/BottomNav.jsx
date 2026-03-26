import { Link, useLocation } from 'react-router-dom'
import { useT } from '../../../i18n/useT'

export default function BottomNav() {
  const location = useLocation()
  const t = useT('nav')
  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-slate-100 dark:border-slate-800">
      <Link to="/dashboard" className={`flex flex-col items-center justify-center px-4 py-1 transition-all ${isActive('/dashboard') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded-xl scale-95' : 'text-slate-400 dark:text-slate-500 hover:text-blue-600'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/dashboard') ? "'FILL' 1" : "" }}>dashboard</span>
        <span className="text-[11px] font-medium tracking-normal">{t.dashboard}</span>
      </Link>
      <Link to="/sales" className={`flex flex-col items-center justify-center px-4 py-1 transition-all ${isActive('/salary') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded-xl scale-95' : 'text-slate-400 dark:text-slate-500 hover:text-blue-600'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/salary') ? "'FILL' 1" : "" }}>payments</span>
        <span className="text-[11px] font-medium tracking-normal">{t.sales}</span>
      </Link>
      <Link to="/kpi" className={`flex flex-col items-center justify-center px-4 py-1 transition-all ${isActive('/kpi') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded-xl scale-95' : 'text-slate-400 dark:text-slate-500 hover:text-blue-600'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/kpi') ? "'FILL' 1" : "" }}>query_stats</span>
        <span className="text-[11px] font-medium tracking-normal">{t.kpi}</span>
      </Link>
      <Link to="/settings" className={`flex flex-col items-center justify-center px-4 py-1 transition-all ${isActive('/settings') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded-xl scale-95' : 'text-slate-400 dark:text-slate-500 hover:text-blue-600'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/settings') ? "'FILL' 1" : "" }}>settings</span>
        <span className="text-[11px] font-medium tracking-normal">{t.settings}</span>
      </Link>
    </nav>
  )
}
