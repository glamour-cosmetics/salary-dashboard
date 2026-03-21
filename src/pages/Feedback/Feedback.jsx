import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/layout/BottomNav/BottomNav'
import { mockEmployee } from '../../data/mockData'

export default function Feedback() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('suggestion')

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="bg-slate-50/80 backdrop-blur-xl text-blue-900 sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">Feedback</span>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[10px] uppercase opacity-60">Reporting Period</span>
          <span className="text-sm font-bold">{mockEmployee.reportingPeriod}</span>
        </div>
      </header>

      <main className="flex-grow container max-w-lg mx-auto px-6 py-8 pb-32">
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
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-surface-container-lowest border-2 border-primary-container'
                      : 'bg-surface-container-lowest border-2 border-transparent hover:bg-white'
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
              className="w-full bg-surface-container-lowest border-none rounded-xl p-4 editorial-shadow focus:ring-2 focus:ring-primary/20"
              rows="6"
              placeholder="Detail your thoughts here..."
            ></textarea>
          </div>

          <button
            onClick={() => navigate('/settings')}
            className="w-full bg-gradient-to-br from-primary-container to-primary text-on-primary py-5 rounded-xl font-bold text-lg tracking-tight editorial-shadow active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            Submit Feedback
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
