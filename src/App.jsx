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
import RoutePage from './pages/Route'
import Visits from './pages/Visits'
import OrderDetail from './pages/OrderDetail'
import ReturnDetail from './pages/ReturnDetail'

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
            <Route path="/route" element={<ProtectedRoute><RoutePage /></ProtectedRoute>} />
            <Route path="/visits" element={<ProtectedRoute><Visits /></ProtectedRoute>} />
            <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
            <Route path="/return/:id" element={<ProtectedRoute><ReturnDetail /></ProtectedRoute>} />
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
