import { useState } from 'react'

function Avatar({ name, avatarUrl }) {
  const [imgFailed, setImgFailed] = useState(false)
  const initials = (name ?? '?')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  if (avatarUrl && !imgFailed) {
    return (
      <img
        alt={name}
        className="w-full h-full object-cover"
        src={avatarUrl}
        onError={() => setImgFailed(true)}
      />
    )
  }
  return (
    <span className="text-sm font-bold text-on-primary select-none">{initials}</span>
  )
}

export default function TopBar({ title, subtitle, avatarUrl, period, onPeriodClick }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-xl flex justify-between items-center w-full px-6 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden shrink-0">
          <Avatar name={subtitle} avatarUrl={avatarUrl} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-l font-bold tracking-tight text-blue-900 truncate">{title}</span>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 truncate">{subtitle}</span>
        </div>
      </div>
      <div className="h-1">
        <button
          onClick={onPeriodClick}
          className="shrink-0 whitespace-nowrap text-[10px] uppercase tracking-widest font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1 active:scale-95 transition-transform pointer"
        >
          {period}
          <span className="material-symbols-outlined text-[14px]">expand_more</span>
        </button>
      </div>
    </header>
  )
}
