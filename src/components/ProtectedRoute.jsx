import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing, mustChangePassword } = useAuth()

  if (initializing) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-4xl text-outline">progress_activity</span>
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/" replace />
  if (mustChangePassword) return <Navigate to="/secure-account" replace />

  return children
}
