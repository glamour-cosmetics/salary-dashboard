import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { TelegramProvider } from './context/TelegramContext'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login/Login'
import SecureAccount from './pages/SecureAccount/SecureAccount'
import Dashboard from './pages/Dashboard/Dashboard'
import Salary from './pages/Salary/Salary'
import KPI from './pages/KPI/KPI'
import Settings from './pages/Settings/Settings'
import Feedback from './pages/Feedback/Feedback'
import Sales from './pages/Sales'

export default function App() {
  return (
    <LanguageProvider>
    <TelegramProvider>
      <AuthProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
            <Route path="/secure-account" element={<SecureAccount />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/salary" element={<ProtectedRoute><Salary /></ProtectedRoute>} />
            <Route path="/kpi" element={<ProtectedRoute><KPI /></ProtectedRoute>} />
            <Route path="/kpi-detail" element={<ProtectedRoute><KPI /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </TelegramProvider>
    </LanguageProvider>
  )
}
