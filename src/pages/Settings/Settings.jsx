import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar/TopBar'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import { mockEmployee } from '../../data/mockData'

export default function Settings() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface pb-32">
      <TopBar
        title="Settings"
        subtitle={mockEmployee.name}
        avatarUrl={mockEmployee.avatarUrl}
        period={mockEmployee.reportingPeriod}
      />

      <main className="px-6 pt-8 space-y-8">
        {/* Profile */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-outline">Profile Identity</h2>
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-low">
                <img className="w-full h-full object-cover" src={mockEmployee.settingsAvatarUrl} alt="Profile" />
              </div>
              <button className="absolute bottom-0 right-0 bg-primary-container text-on-primary w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-surface-container-lowest">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold">{mockEmployee.name}</h3>
              <p className="text-sm text-on-surface-variant">{mockEmployee.grade} • ID: {mockEmployee.id}</p>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-outline">App Preferences</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">language</span>
                <span className="text-sm font-semibold">Language Selection</span>
              </div>
              <div className="flex bg-surface-container-high rounded-lg p-1">
                <button className="flex-1 py-2 text-xs font-bold rounded-md bg-surface-container-lowest text-primary shadow-sm">РУССКИЙ</button>
                <button className="flex-1 py-2 text-xs font-medium text-on-surface-variant">O'ZBEKCHA</button>
              </div>
            </div>

            <button
              onClick={() => navigate('/feedback')}
              className="bg-primary-container text-on-primary rounded-xl p-5 flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">forum</span>
                <div className="text-left">
                  <span className="block text-sm font-semibold">Support & Feedback</span>
                  <span className="block text-[11px] opacity-80">Help us improve your experience</span>
                </div>
              </div>
              <span className="material-symbols-outlined">open_in_new</span>
            </button>
          </div>
        </section>

        <button
          onClick={() => navigate('/')}
          className="w-full py-4 text-error font-bold text-sm bg-error-container/20 rounded-xl flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Sign Out from Ledger
        </button>
      </main>

      <BottomNav />
    </div>
  )
}
