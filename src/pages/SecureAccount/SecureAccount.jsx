import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { changePassword as apiChangePassword } from '../../services/api'
import { useT } from '../../i18n/useT'

function validate(password) {
  return {
    minLength: password.length >= 8,
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  }
}

function RuleItem({ met, label }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`material-symbols-outlined text-[18px] ${met ? 'text-secondary' : 'text-outline-variant'}`}
        style={met ? { fontVariationSettings: "'FILL' 1" } : {}}
      >
        {met ? 'check_circle' : 'radio_button_unchecked'}
      </span>
      <span className="text-[0.8125rem]">{label}</span>
    </div>
  )
}

export default function SecureAccount() {
  const navigate = useNavigate()
  const { isAuthenticated, mustChangePassword, onPasswordChanged } = useAuth()
  const t = useT('security')

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Route guards
  if (!isAuthenticated) return <Navigate to="/" replace />
  if (!mustChangePassword) return <Navigate to="/dashboard" replace />

  const rules = validate(newPassword)
  const allRulesMet = rules.minLength && rules.hasNumber && rules.hasSpecial

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!allRulesMet) {
      setError(t.errorRequirements)
      return
    }
    if (newPassword !== confirm) {
      setError(t.errorMatch)
      return
    }

    setLoading(true)
    try {
      await apiChangePassword(oldPassword, newPassword)
      onPasswordChanged()
      navigate('/dashboard')
    } catch {
      setError(t.errorFailed)
    } finally {
      setLoading(false)
    }
  }

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
            <h2 className="text-[1.5rem] font-bold tracking-tight text-on-surface mb-3 leading-tight">{t.title}</h2>
            <p className="text-[0.875rem] text-on-surface-variant leading-relaxed">{t.subtitle}</p>
          </div>

          <div className="bg-surface-container-low rounded-xl p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* Current password */}
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-widest text-outline block">{t.currentPassword}</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3.5 text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                    type={showOld ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" onClick={() => setShowOld(v => !v)}>
                    <span className="material-symbols-outlined text-[20px]">{showOld ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* New password */}
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-widest text-outline block">{t.newPassword}</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3.5 text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                    type={showNew ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" onClick={() => setShowNew(v => !v)}>
                    <span className="material-symbols-outlined text-[20px]">{showNew ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-widest text-outline block">{t.confirmPassword}</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3.5 text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline" onClick={() => setShowConfirm(v => !v)}>
                    <span className="material-symbols-outlined text-[20px]">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-surface-container-high/40 rounded-lg p-4 space-y-3">
                <p className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant mb-1">{t.securityStandards}</p>
                <RuleItem met={rules.minLength} label={t.ruleLength} />
                <RuleItem met={rules.hasNumber} label={t.ruleNumber} />
                <RuleItem met={rules.hasSpecial} label={t.ruleSpecial} />
              </div>

              {error && <p className="text-error text-sm font-medium text-center">{error}</p>}

              <button
                className="w-full bg-gradient-to-br from-primary-container to-primary text-on-primary font-semibold py-4 rounded-lg shadow-lg active:scale-95 transition-transform disabled:opacity-60"
                type="submit"
                disabled={loading || !oldPassword}
              >
                {loading ? t.saving : t.saveAndContinue}
              </button>
            </form>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-outline">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span className="text-[0.75rem] font-medium tracking-tight">{t.encrypted}</span>
          </div>
        </div>
      </main>
    </div>
  )
}
