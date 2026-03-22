import { createContext, useContext, useState, useEffect } from 'react'
import { formatPeriod } from '../utils/formatters'
import { getDashboard } from '../services/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'token'
const EMPLOYEE_KEY = 'employee'
const TTL = 60 * 60 * 1000 // 1 hour

function cacheKey(workplaceId, month, year) {
  return `dashboard_${workplaceId}_${month}_${year}`
}

function readCache(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) // { data, timestamp }
  } catch {
    return null
  }
}

function writeCache(key, data) {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }))
}

function loadFromStorage() {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const employee = JSON.parse(localStorage.getItem(EMPLOYEE_KEY))
    return token && employee ? { token, employee } : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const stored = loadFromStorage()
  const now = new Date()

  const [token, setToken] = useState(stored?.token ?? null)
  const [employee, setEmployee] = useState(stored?.employee ?? null)
  const [mustChangePassword, setMustChangePassword] = useState(false)
  const [period, setPeriod] = useState({ month: now.getMonth() + 1, year: now.getFullYear() })
  const [dashboardData, setDashboardData] = useState(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)

  useEffect(() => {
    if (!employee) return

    const { workplace_id } = employee
    const { month, year } = period
    const key = cacheKey(workplace_id, month, year)
    let timeoutId

    function scheduleRefresh(afterMs) {
      timeoutId = setTimeout(async () => {
        try {
          const data = await getDashboard(workplace_id, month, year)
          writeCache(key, data)
          setDashboardData(data)
        } finally {
          scheduleRefresh(TTL)
        }
      }, afterMs)
    }

    const cached = readCache(key)
    if (cached) {
      setDashboardData(cached.data)
      setDashboardLoading(false)
      const remaining = Math.max(0, TTL - (Date.now() - cached.timestamp))
      scheduleRefresh(remaining)
    } else {
      setDashboardLoading(true)
      setDashboardData(null)
      getDashboard(workplace_id, month, year)
        .then(data => {
          writeCache(key, data)
          setDashboardData(data)
          scheduleRefresh(TTL)
        })
        .finally(() => setDashboardLoading(false))
    }

    return () => clearTimeout(timeoutId)
  }, [period.month, period.year, employee?.workplace_id])

  function login(data) {
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(data.employee))
    setToken(data.token)
    setEmployee(data.employee)
    setMustChangePassword(data.mustChangePassword ?? false)
  }

  function onPasswordChanged() {
    setMustChangePassword(false)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMPLOYEE_KEY)
    setToken(null)
    setEmployee(null)
    setDashboardData(null)
    setMustChangePassword(false)
  }

  return (
    <AuthContext.Provider value={{
      token,
      employee,
      isAuthenticated: !!token,
      mustChangePassword,
      period,
      setPeriod,
      periodLabel: formatPeriod(period),
      dashboardData,
      dashboardLoading,
      login,
      onPasswordChanged,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
