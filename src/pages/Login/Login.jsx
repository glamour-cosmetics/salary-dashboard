import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { mustChangePassword } = await signIn(login, password)
      navigate(mustChangePassword ? '/secure-account' : '/dashboard')
    } catch (err) {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="fixed top-0 w-full z-50 glass-header flex items-center justify-center px-6 py-8">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
          <span className="text-lg font-bold tracking-tighter text-primary">Stratos Trust Ledger</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-[440px] space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-[3.5rem] font-black leading-none tracking-tight text-on-surface">Welcome Back</h1>
            <p className="text-on-surface-variant font-medium tracking-wide">Access your performance ledger</p>
          </div>

          <div className="bg-surface-container-low rounded-xl p-8 space-y-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-outline ml-1">Login</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Username"
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
                <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-outline ml-1">Password</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-4 text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="••••••••"
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
                {loading ? 'Signing In…' : 'Sign In'}
              </button>
            </form>

            <div className="flex flex-col items-center gap-4 pt-4">
              <a className="text-primary font-bold text-sm hover:underline" href="#">Forgot Password?</a>
              <div className="h-4 w-[1px] bg-surface-container-highest"></div>
              <a className="text-on-surface-variant font-medium text-sm flex items-center gap-2" href="#">
                <span className="material-symbols-outlined text-lg">support_agent</span>
                Contact Admin
              </a>
            </div>
          </div>

          <div className="text-center pt-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-surface-container-high rounded-full">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-outline">System Secured by Stratos Protocol</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
