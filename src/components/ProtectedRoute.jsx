import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, mustChangePassword } = useAuth()

  if (!isAuthenticated) return <Navigate to="/" replace />
  if (mustChangePassword) return <Navigate to="/secure-account" replace />

  return children
}
