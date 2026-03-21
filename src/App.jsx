import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { TelegramProvider } from './context/TelegramContext'

import Login from './pages/Login/Login'
import SecureAccount from './pages/SecureAccount/SecureAccount'
import Dashboard from './pages/Dashboard/Dashboard'
import Salary from './pages/Salary/Salary'
import KPI from './pages/KPI/KPI'
import Settings from './pages/Settings/Settings'
import Feedback from './pages/Feedback/Feedback'

export default function App() {
  return (
    <TelegramProvider>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/secure-account" element={<SecureAccount />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/salary" element={<Salary />} />
          <Route path="/kpi" element={<KPI />} />
          <Route path="/kpi-detail" element={<KPI />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </MemoryRouter>
    </TelegramProvider>
  )
}
