import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import { useAuth } from '../../context/AuthContext'
import { submitFeedback } from '../../services/api'

export default function Feedback() {
  const navigate = useNavigate()
  const { employee, period, periodLabel } = useAuth()

  const [selectedCategory, setSelectedCategory] = useState('suggestion')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit() {
    if (!message.trim()) return
    setLoading(true)
    try {
      await submitFeedback({
        category: selectedCategory,
        message,
        employeeId: employee.id,
        period,
      })
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="bg-slate-50/80 backdrop-blur-xl text-blue-900 sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4">
        <span className="text-lg font-bold">Feedback</span>
        <div className="text-right flex flex-col items-end">
          <span className="text-[10px] uppercase opacity-60">Reporting Period</span>
          <span className="text-sm font-bold">{periodLabel}</span>
        </div>
      </header>

      <main className="flex-grow container max-w-lg mx-auto px-6 py-8 pb-32">
        {submitted ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
            <span className="material-symbols-outlined text-secondary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <h2 className="text-xl font-bold">Thank you!</h2>
            <p className="text-on-surface-variant text-sm">Your feedback has been submitted.</p>
            <button onClick={() => navigate('/settings')} className="mt-4 text-primary font-bold text-sm">Back to Settings</button>
          </div>
        ) : (
          <>
            <section className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                Share Your <span className="text-primary">Feedback</span>
              </h2>
              <p className="text-on-surface-variant max-w-xs mx-auto">Help us refine the Sovereign Ledger. Every detail matters.</p>
            </section>

            <div className="space-y-8">
              {/* Category selector */}
              <div className="bg-surface-container-low rounded-xl p-6">
                <label className="block text-[11px] uppercase tracking-[0.15em] font-bold text-outline mb-4">Select Category</label>
                <div className="grid grid-cols-1 gap-3">
                  {['suggestion', 'bug', 'compliment'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 border-2 ${
                        selectedCategory === cat
                          ? 'bg-surface-container-lowest border-primary-container'
                          : 'bg-surface-container-lowest border-transparent hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined">
                          {cat === 'suggestion' ? 'lightbulb' : cat === 'bug' ? 'bug_report' : 'sentiment_very_satisfied'}
                        </span>
                        <span className="font-semibold capitalize">{cat}</span>
                      </div>
                      {selectedCategory === cat && (
                        <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="bg-surface-container-low rounded-xl p-6">
                <textarea
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 editorial-shadow focus:ring-2 focus:ring-primary/20 outline-none text-on-surface"
                  rows="6"
                  placeholder="Detail your thoughts here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !message.trim()}
                className="w-full bg-gradient-to-br from-primary-container to-primary text-on-primary py-5 rounded-xl font-bold text-lg tracking-tight editorial-shadow active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
              >
                {loading ? 'Submitting…' : 'Submit Feedback'}
                {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
              </button>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
