/**
 * API service layer
 * All backend calls go through here — swap BASE_URL to point at real backend
 */

import { mockEmployee, mockSalary, mockKPI } from '../data/mockData'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''
const MOCK = import.meta.env.VITE_MOCK === 'true'

const mockHandlers = {
  'POST /auth/login': ({ username }) => ({
    token: 'mock-jwt-token',
    employee: mockEmployee,
    mustChangePassword: username === 'new_user',
  }),
  'POST /auth/change-password': () => ({}),
  'GET /employees': () => mockEmployee,
  'GET /salary-dashboard': () => ({ salary: mockSalary, kpi: mockKPI }),
  'POST /feedback': () => ({ success: true }),
}

function mockRequest(path, options = {}) {
  const method = options.method ?? 'GET'
  const body = options.body ? JSON.parse(options.body) : {}

  const key = Object.keys(mockHandlers).find((k) => {
    const [m, p] = k.split(' ')
    return m === method && path.includes(p)
  })

  if (!key) throw new Error(`No mock handler for ${method} ${path}`)
  return Promise.resolve(mockHandlers[key](body))
}

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, options = {}) {
  console.log(`Path: ${path}`)
  if (MOCK) return mockRequest(path, options)
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const { headers: _h, ...rest } = options
  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers })
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json()
}

/** Authenticate employee with username + password */
export function login(username, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

/** Change password on first login */
export function changePassword(newPassword) {
  return request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ newPassword }),
  })
}

/** Get employee profile */
export function getEmployee(employeeId) {
  return request(`/employees/${employeeId}`)
}

/** Get salary dashboard (salary + KPI) for a given period */
export function getDashboard(workplaceId, month, year) {
  const params = new URLSearchParams({ workplace_id: workplaceId, month, year })
  return request(`/salary-dashboard/?${params}`)
}

/** Submit feedback */
export function submitFeedback(payload) {
  return request('/feedback', { method: 'POST', body: JSON.stringify(payload) })
}
