import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import { useT } from '../../i18n/useT'
import { submitFeedback } from '../../services/api'

const CATEGORIES = ['suggestion', 'bug', 'compliment']
const CATEGORY_ICONS = { suggestion: 'lightbulb', bug: 'bug_report', compliment: 'sentiment_very_satisfied' }

export default function Feedback() {
  const navigate = useNavigate()
  const t = useT('feedback')

  const [selectedCategory, setSelectedCategory] = useState('suggestion')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit() {
    if (!message.trim()) return
    setLoading(true)
    try {
      await submitFeedback({ category: selectedCategory, message })
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="bg-slate-50/80 backdrop-blur-xl text-blue-900 sticky top-0 z-50 flex items-center w-full px-6 py-4">
        <button onClick={() => navigate(-1)} className="mr-3 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-on-surface">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <span className="text-lg font-bold">{t.title}</span>
      </header>

      <main className="flex-grow container max-w-lg mx-auto px-6 py-8 pb-32">
        {submitted ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
            <span className="material-symbols-outlined text-secondary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <h2 className="text-xl font-bold">{t.successTitle}</h2>
            <p className="text-on-surface-variant text-sm">{t.successMessage}</p>
            <button onClick={() => navigate('/settings')} className="mt-4 text-primary font-bold text-sm">{t.backToSettings}</button>
          </div>
        ) : (
          <>
            <section className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                {t.heading} <span className="text-primary">{t.headingHighlight}</span>
              </h2>
              <p className="text-on-surface-variant max-w-xs mx-auto">{t.subheading}</p>
            </section>

            <div className="space-y-8">
              <div className="bg-surface-container-low rounded-xl p-6">
                <label className="block text-[11px] uppercase tracking-[0.15em] font-bold text-outline mb-4">{t.categoryLabel}</label>
                <div className="grid grid-cols-1 gap-3">
                  {CATEGORIES.map(cat => (
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
                        <span className="material-symbols-outlined">{CATEGORY_ICONS[cat]}</span>
                        <span className="font-semibold">{t[cat]}</span>
                      </div>
                      {selectedCategory === cat && (
                        <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-6">
                <textarea
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 editorial-shadow focus:ring-2 focus:ring-primary/20 outline-none text-on-surface"
                  rows="6"
                  placeholder={t.messagePlaceholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !message.trim()}
                className="w-full bg-gradient-to-br from-primary-container to-primary text-on-primary py-5 rounded-xl font-bold text-lg tracking-tight editorial-shadow active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
              >
                {loading ? t.submitting : t.submit}
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
