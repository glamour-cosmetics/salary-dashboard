import { useNavigate } from 'react-router-dom'

export default function SecureAccount() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-900">account_balance_wallet</span>
          <h1 className="text-lg font-bold tracking-tighter text-blue-900">Stratos Trust</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12">
        <div className="max-w-md w-full">
          <div className="mb-10 text-left">
            <h2 className="text-[1.5rem] font-bold tracking-tight text-on-surface mb-3 leading-tight">Secure Your Account</h2>
            <p className="text-[0.875rem] text-on-surface-variant leading-relaxed">Since this is your first time logging in, please set a new password.</p>
          </div>

          <div className="bg-surface-container-low rounded-xl p-6">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard') }}>
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-widest text-outline block">New Password</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3.5" type="password" placeholder="••••••••" />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-widest text-outline block">Confirm New Password</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3.5" type="password" placeholder="••••••••" />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
              </div>

              <div className="bg-surface-container-high/40 rounded-lg p-4 space-y-3">
                <p className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Security Standards</p>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-[0.8125rem]">At least 8 characters</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-outline-variant">radio_button_unchecked</span>
                  <span className="text-[0.8125rem]">One number (0-9)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-outline-variant">radio_button_unchecked</span>
                  <span className="text-[0.8125rem]">One special character (!@#)</span>
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-br from-primary-container to-primary text-on-primary font-semibold py-4 rounded-lg shadow-lg active:scale-95 transition-transform"
                type="submit"
              >
                Save & Continue
              </button>
            </form>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-outline">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span className="text-[0.75rem] font-medium tracking-tight">End-to-end encrypted password storage</span>
          </div>
        </div>
      </main>
    </div>
  )
}
