import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar/TopBar'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { useT } from '../../i18n/useT'

export default function Settings() {
  const navigate = useNavigate()
  const { employee, logout } = useAuth()
  const { language, changeLanguage, LANGUAGES } = useLanguage()
  const t = useT('settings')

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-surface pb-32">
      <TopBar
        title={t.title}
        subtitle={employee.name}
        avatarUrl={employee.avatarUrl}
      />

      <main className="px-6 pt-8 space-y-8">
        {/* Profile */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-outline">{t.profileIdentity}</h2>
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-low">
              <img className="w-full h-full object-cover" src="/profile.jpg" alt="Profile" />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold">{employee.name}</h3>
              <p className="text-sm text-on-surface-variant">{employee.id}</p>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-outline">{t.appPreferences}</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">language</span>
                <span className="text-sm font-semibold">{t.languageSelection}</span>
              </div>
              <div className="flex bg-surface-container-high rounded-lg p-1 gap-1">
                {LANGUAGES.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => changeLanguage(code)}
                    className={`flex-1 py-2 text-xs rounded-md transition-all ${
                      language === code
                        ? 'font-bold bg-surface-container-lowest text-primary shadow-sm'
                        : 'font-medium text-on-surface-variant'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/feedback')}
              className="bg-primary-container text-on-primary rounded-xl p-5 flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">forum</span>
                <div className="text-left">
                  <span className="block text-sm font-semibold">{t.supportFeedback}</span>
                  <span className="block text-[11px] opacity-80">{t.supportSubtitle}</span>
                </div>
              </div>
              <span className="material-symbols-outlined">open_in_new</span>
            </button>
          </div>
        </section>

        <button
          onClick={handleLogout}
          className="w-full py-4 text-error font-bold text-sm bg-error-container/20 rounded-xl flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          {t.signOut}
        </button>
      </main>

      <BottomNav />
    </div>
  )
}
