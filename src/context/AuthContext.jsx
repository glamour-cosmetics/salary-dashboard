import { createContext, useContext, useState, useEffect } from 'react'
import { formatPeriod } from '../utils/formatters'
import { apiLogin, getProfile, getDashboard, setTokens, clearTokens, initTokens } from '../services/api'
import { useLanguage } from './LanguageContext'
import translations from '../i18n/translations'

const AuthContext = createContext(null)

const TTL = 60 * 60 * 1000 // 1 hour
function cacheKey(workplaceId, month, year) {
  return `dashboard_${workplaceId}_${month}_${year}`
}

function readCache(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeCache(key, data) {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }))
}

const INVALID = new Set([null, 'null', undefined, 'undefined', ''])

function saveProfileToStorage(profile) {
  const userId = profile.id
  const workplaceId = profile.workplace?.id
  if (INVALID.has(userId) || INVALID.has(workplaceId)) {
    throw new Error(`Invalid profile data: id=${userId}, workplace.id=${workplaceId}`)
  }
  localStorage.setItem('user_id', String(userId))
  localStorage.setItem('workplace_id', String(workplaceId))
  localStorage.setItem('profile', JSON.stringify(profile))
  return { userId: String(userId), workplaceId: String(workplaceId) }
}

function loadProfileFromStorage() {
  try {
    const profile = JSON.parse(localStorage.getItem('profile'))
    const userId = localStorage.getItem('user_id')
    const workplaceId = localStorage.getItem('workplace_id')
    if (!profile || INVALID.has(userId) || INVALID.has(workplaceId)) return null
    return { profile, userId, workplaceId }
  } catch {
    return null
  }
}

function getDisplayName(profile) {
  return profile.natural_person_name
    || profile.full_name
    || [profile.first_name, profile.last_name].filter(Boolean).join(' ')
    || profile.username
    || 'Unknown'
}

export function AuthProvider({ children }) {
  const { language } = useLanguage()

  const now = new Date()
  const [initializing, setInitializing] = useState(true)
  const [profile, setProfile] = useState(null)
  const [workplaceId, setWorkplaceId] = useState(null)
  const [userId, setUserId] = useState(null)
  const [mustChangePassword, setMustChangePassword] = useState(false)
  const [period, setPeriod] = useState({ month: now.getMonth() + 1, year: now.getFullYear() })

  // On mount: load tokens from CloudStorage, then restore profile from
  // localStorage (fast path) or re-fetch from API (after iOS WebView wipe).
  useEffect(() => {
    initTokens().then(async () => {
      const stored = loadProfileFromStorage()
      if (stored) {
        setProfile(stored.profile)
        setWorkplaceId(stored.workplaceId)
        setUserId(stored.userId)
        setMustChangePassword(stored.profile.must_change_password ?? false)
      } else {
        try {
          const profileData = await getProfile()
          const { userId: uid, workplaceId: wid } = saveProfileToStorage(profileData)
          setProfile(profileData)
          setUserId(uid)
          setWorkplaceId(wid)
          setMustChangePassword(profileData.must_change_password ?? false)
        } catch {
          // No valid tokens — user must log in
        }
      }
      setInitializing(false)
    })
  }, [])
  const [dashboardData, setDashboardData] = useState(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)

  // Derived — automatically true whenever profile+workplaceId are in state (survives HMR)
  const isAuthenticated = !!profile && !!workplaceId

  useEffect(() => {
    if (!workplaceId || mustChangePassword) return

    const { month, year } = period
    const key = cacheKey(workplaceId, month, year)
    let timeoutId

    function scheduleRefresh(afterMs) {
      timeoutId = setTimeout(async () => {
        try {
          const data = await getDashboard(workplaceId, month, year)
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
      getDashboard(workplaceId, month, year)
        .then(data => {
          writeCache(key, data)
          setDashboardData(data)
          scheduleRefresh(TTL)
        })
        .finally(() => setDashboardLoading(false))
    }

    return () => clearTimeout(timeoutId)
  }, [period.month, period.year, workplaceId])

  /** Login: obtains tokens → fetches profile → saves workplace_id + user_id → updates state */
  async function signIn(login, password) {
    const { data: tokens } = await apiLogin(login, password)
    setTokens(tokens.access, tokens.refresh)

    const profileData = await getProfile()

    if ((profileData.workplace?.role_type ?? '') !== 'SALES_MANAGER') {
      clearTokens()
      const err = new Error('unauthorized_role')
      err.code = 'unauthorized_role'
      throw err
    }

    const { userId: uid, workplaceId: wid } = saveProfileToStorage(profileData)

    setProfile(profileData)
    setUserId(uid)
    setWorkplaceId(wid)
    setMustChangePassword(profileData.must_change_password ?? false)

    return { mustChangePassword: profileData.must_change_password ?? false }
  }

  function onPasswordChanged() {
    setMustChangePassword(false)
    // Keep stored profile in sync so page refresh doesn't re-trigger the guard
    try {
      const stored = JSON.parse(localStorage.getItem('profile'))
      if (stored) {
        localStorage.setItem('profile', JSON.stringify({ ...stored, must_change_password: false }))
      }
    } catch { /* ignore */ }
  }

  function logout() {
    clearTokens()
    // Clear all app keys from localStorage
    Object.keys(localStorage)
      .filter(k => k.startsWith('dashboard_'))
      .forEach(k => localStorage.removeItem(k))
    localStorage.removeItem('user_id')
    localStorage.removeItem('workplace_id')
    localStorage.removeItem('profile')
    setProfile(null)
    setUserId(null)
    setWorkplaceId(null)
    setDashboardData(null)
    setMustChangePassword(false)
  }

  // Derived display fields for components
  const employee = profile ? {
    id: userId,
    workplace_id: workplaceId,
    name: getDisplayName(profile),
    avatarUrl: profile.photo_url ?? null,
    role_type: profile.workplace?.role_type ?? '',
    workplace_name: profile.workplace?.name ?? '',
    organization_name: profile.workplace?.organization_name ?? '',
    rooms: profile.workplace?.rooms ?? [],
  } : null

  return (
    <AuthContext.Provider value={{
      employee,
      userId,
      workplaceId,
      isAuthenticated,
      initializing,
      mustChangePassword,
      period,
      setPeriod,
      periodLabel: formatPeriod(period, translations[language]?.modal?.months),
      dashboardData,
      dashboardLoading,
      signIn,
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
