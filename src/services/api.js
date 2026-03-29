const BASE_URL = import.meta.env.VITE_API_URL
const MOCK = import.meta.env.VITE_MOCK === 'true'
// ---------------------------------------------------------------------------
// Token management — module-level so auto-refresh can update without context
// ---------------------------------------------------------------------------
let _access = localStorage.getItem('access_token')
let _refresh = localStorage.getItem('refresh_token')

export function setTokens(access, refresh) {
  _access = access
  _refresh = refresh
  localStorage.setItem('access_token', access)
  if (refresh != null) localStorage.setItem('refresh_token', refresh)
}

export function clearTokens() {
  _access = null
  _refresh = null
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

async function tryRefresh() {
  if (!_refresh) throw new Error('No refresh token')
  const res = await fetch(`${BASE_URL}/smartupx/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: _refresh }),
  })
  if (!res.ok) throw new Error('Refresh failed')
  const { data } = await res.json()
  setTokens(data.access, _refresh)
}

// ---------------------------------------------------------------------------
// Core request — retries once after auto-refresh on 401
// ---------------------------------------------------------------------------
async function request(path, options = {}, _retry = true) {
  if (MOCK) return mockRequest(path, options)

  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (_access) headers['Authorization'] = `Bearer ${_access}`

  const { headers: _h, ...rest } = options
  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers })

  if (res.status === 401 && _retry) {
    await tryRefresh()
    return request(path, options, false)
  }

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`${res.status}: ${text}`)
  }

  return res.json()
}

// ---------------------------------------------------------------------------
// Mock support
// ---------------------------------------------------------------------------
import { mockEmployee, mockSalary, mockKPI } from '../data/mockData'

const mockHandlers = {
  'POST /smartupx/auth/token/': ({ login }) => ({
    status: true,
    data: { access: 'mock-access', refresh: 'mock-refresh' },
  }),
  'GET /smartupx/profile/': () => ({
    id: 1,
    first_name: mockEmployee.name,
    last_name: '',
    workplace: { id: mockEmployee.workplace_id, name: 'Mock Workplace', role_type: 'SALES_MANAGER' },
    must_change_password: false,
  }),
  'POST /smartupx/auth/change-password/': () => ({}),
  'GET /smartupx/salary-dashboard/': () => ({ salary: mockSalary, kpi: mockKPI }),
}

function mockRequest(path, options = {}) {
  const method = options.method ?? 'GET'
  const body = options.body ? JSON.parse(options.body) : {}
  const key = Object.keys(mockHandlers).find((k) => {
    const [m, p] = k.split(' ')
    return m === method && path.startsWith(p)
  })
  if (!key) throw new Error(`No mock handler for ${method} ${path}`)
  return Promise.resolve(mockHandlers[key](body))
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/** POST /smartupx/auth/token/ → { status, data: { access, refresh } } */
export function apiLogin(login, password) {
  return request('/smartupx/auth/token/', {
    method: 'POST',
    body: JSON.stringify({ login, password }),
  })
}

/** GET /smartupx/profile/ → unwrapped profile object */
export async function getProfile() {
  const res = await request('/smartupx/profile/')
  return res.data ?? res
}

/** POST /smartupx/auth/change-password/ */
export function changePassword(oldPassword, newPassword) {
  return request('/smartupx/auth/change-password/', {
    method: 'POST',
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  })
}

// ---------------------------------------------------------------------------
// Dashboard response transformer — maps real API fields to UI shape
// ---------------------------------------------------------------------------
function toFloat(v) { return parseFloat(v) || 0 }

function buildSalaryComponents(breakdown) {
  const map = [
    { id: 'base_salary',                 icon: 'work',           field: 'base_salary' },
    { id: 'kpi_bonus',                   icon: 'star',            field: 'kpi_bonus',                 highlight: true },
    { id: 'overachievement_bonus',       icon: 'trending_up',     field: 'overachievement_bonus',     highlight: true },
    { id: 'transportation_compensation', icon: 'directions_car',  field: 'transportation_compensation' },
    { id: 'qualification_bonus',         icon: 'school',          field: 'qualification_bonus' },
  ]
  return map
    .filter(({ field }) => toFloat(breakdown?.[field]) > 0)
    .map(({ field, ...rest }) => ({ ...rest, amount: toFloat(breakdown?.[field]) }))
}

function transformDashboard(raw) {
  const b = raw.breakdown ?? {}
  const ach = raw.achievements ?? {}
  return {
    salary: {
      total:       toFloat(raw.total_salary),
      currency:    'UZS',
      period:      `${raw.month}/${raw.year}`,
      trendKey:    toFloat(raw.overall_achievement) >= 100 ? 'on_target' : 'below_plan',
      planName:    raw.salary_plan_name ?? '',
      workingDays: { completed: raw.elapsed_workdays ?? 0, total: raw.total_workdays ?? 1 },
      components:  buildSalaryComponents(b),
    },
    kpi: {
      planAchievement: toFloat(raw.overall_achievement),
      // Sales
      salesPlan:    toFloat(raw.plan_data?.sales_plan),
      actualRevenue: toFloat(raw.actual_data?.sales_actual),
      ordersTotal:  toFloat(raw.actual_data?.orders_total),
      returnsTotal: Math.abs(toFloat(raw.actual_data?.returns_total)),
      overplan:     Math.max(0, toFloat(raw.actual_data?.sales_actual) - toFloat(raw.plan_data?.sales_plan)),
      sales: {
        plan:        toFloat(raw.plan_data?.sales_plan),
        actual:      toFloat(raw.actual_data?.sales_actual),
        achievement: toFloat(ach.sales_percent),
      },
      visits: {
        plan:        raw.plan_data?.visit_plan ?? 0,
        actual:      raw.actual_data?.visits_actual ?? 0,
        achievement: toFloat(ach.visits_percent),
      },
      acb: {
        plan:        raw.plan_data?.acb_plan ?? 0,
        actual:      raw.actual_data?.acb_actual ?? 0,
        achievement: toFloat(ach.acb_percent),
      },
      payments: {
        plan:        toFloat(raw.plan_data?.payment_plan),
        actual:      toFloat(raw.actual_data?.payments_actual),
        achievement: toFloat(ach.payments_percent),
      },
      overachievementSteps: {
        completed:     raw.overachievement_steps ?? 0,
        total:         Math.max((raw.overachievement_steps ?? 0) + 1, 3),
        salesGap:      toFloat(raw.sales_gap_to_next_bonus),
        nextGoalBonus: toFloat(raw.next_bonus_amount),
      },
      belowThreshold: raw.below_threshold ?? false,
    },
    // raw response kept for any page that needs unmodified fields
    _raw: raw,
  }
}

/** GET /smartupx/salary-dashboard/ */
export async function getDashboard(workplaceId, month, year) {
  const params = new URLSearchParams({ workplace_id: workplaceId, month, year })
  const res = await request(`/smartupx/salary-dashboard/?${params}`)
  return transformDashboard(res.data ?? res)
}

/** GET /smartupx/sales/daily/ */
export function getDailySales(workplaceId, date) {
  const params = new URLSearchParams({ workplace_id: workplaceId, date })
  return request(`/smartupx/sales/daily/?${params}`)
}

/** GET /smartupx/sales/order/{id}/ */
export async function getOrderDetail(orderId) {
  const res = await request(`/smartupx/sales/order/${orderId}/`)
  return res.data ?? res
}

/** GET /smartupx/sales/return/{id}/ */
export async function getReturnDetail(returnId) {
  const res = await request(`/smartupx/sales/return/${returnId}/`)
  return res.data ?? res
}

/** GET /smartupx/route/clients/ */
export async function getRouteClients({ weekday, likelyToOrder, page = 1 } = {}) {
  const params = new URLSearchParams()
  if (weekday != null) params.set('weekday', weekday)
  if (likelyToOrder) params.set('likely_to_order', 'true')
  params.set('page', page)
  return request(`/smartupx/route/clients/?${params}`)
}

/** POST /smartupx/feedback/ */
export function submitFeedback({ category, message }) {
  return request('/smartupx/feedback/', {
    method: 'POST',
    body: JSON.stringify({ category, message }),
  })
}
