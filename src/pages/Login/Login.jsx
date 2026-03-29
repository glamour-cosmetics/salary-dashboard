import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { useT } from '../../i18n/useT'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const { language, changeLanguage, LANGUAGES } = useLanguage()
  const t = useT('login')

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLang = LANGUAGES.find(l => l.code === language)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { mustChangePassword } = await signIn(login, password)
      navigate(mustChangePassword ? '/secure-account' : '/dashboard')
    } catch (err) {
      setError(t.errorCredentials)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="fixed top-0 w-full z-50 glass-header flex items-center justify-between px-6 py-8">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
          <span className="text-lg font-bold tracking-tighter text-primary">Stratos Trust Ledger</span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-base text-primary">language</span>
            {currentLang?.label}
            <span className="material-symbols-outlined text-base">{dropdownOpen ? 'expand_less' : 'expand_more'}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-surface-container-lowest rounded-xl shadow-lg overflow-hidden z-50">
              {LANGUAGES.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => { changeLanguage(code); setDropdownOpen(false) }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${
                    language === code
                      ? 'text-primary bg-primary/10'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-[440px] space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-[2.5rem] font-black leading-none tracking-tight text-on-surface">{t.title}</h1>
            <p className="text-on-surface-variant font-medium tracking-wide">{t.subtitle}</p>
          </div>

          <div className="bg-surface-container-low rounded-xl p-8 space-y-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-outline ml-1">{t.labelLogin}</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={t.placeholderLogin}
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center text-outline/30">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-outline ml-1">{t.labelPassword}</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={t.placeholderPassword}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center text-outline/30">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-error text-sm font-medium text-center">{error}</p>
              )}

              <button
                className="w-full editorial-gradient text-on-primary py-5 rounded-lg font-bold tracking-tight text-lg shadow-[0_12px_32px_rgba(0,70,140,0.15)] active:scale-95 transition-transform disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? t.signingIn : t.signIn}
              </button>
            </form>

            <div className="flex flex-col items-center gap-4 pt-4">
              <a className="text-primary font-bold text-sm hover:underline" href="#">{t.forgotPassword}</a>
              <div className="h-4 w-[1px] bg-surface-container-highest"></div>
              <a className="text-on-surface-variant font-medium text-sm flex items-center gap-2" href="https://t.me/gc_abdulaziz">
                <span className="material-symbols-outlined text-lg">support_agent</span>
                {t.contactAdmin}
              </a>
            </div>
          </div>

          <div className="text-center pt-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-surface-container-high rounded-full">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-outline">{t.securedBy}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
