/**
 * API service layer
 * All backend calls go through here — swap BASE_URL to point at real backend
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json()
}

/** Authenticate employee with phone + password */
export function login(phone, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  })
}

/** Get employee profile */
export function getEmployee(employeeId) {
  return request(`/employees/${employeeId}`)
}

/** Get salary breakdown for a period */
export function getSalary(employeeId, period) {
  return request(`/employees/${employeeId}/salary?period=${period}`)
}

/** Get KPI data for a period */
export function getKPI(employeeId, period) {
  return request(`/employees/${employeeId}/kpi?period=${period}`)
}

/** Submit feedback */
export function submitFeedback(payload) {
  return request('/feedback', { method: 'POST', body: JSON.stringify(payload) })
}
