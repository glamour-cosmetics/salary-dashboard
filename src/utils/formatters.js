/**
 * Format a number as UZS currency
 * @param {number} amount
 * @param {string} currency
 */
export function formatCurrency(amount, currency = 'UZS') {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/,/g, '\u00A0')
  return currency ? formatted + '\u00A0' + currency : formatted
}

/**
 * Format a percentage value
 * @param {number} value
 */
export function formatPercent(value) {
  return value.toFixed(2) + '%'
}

/**
 * Format large numbers with compact notation (e.g. 12.6M)
 * @param {number} value
 */
export function formatCompact(value) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

/**
 * Format a { month, year } period object into a human-readable label
 * @param {{ month: number, year: number }} period
 */
export function formatPeriod({ month, year }, monthNames) {
  if (monthNames) return `${monthNames[month - 1]} ${year}`
  return new Date(year, month - 1).toLocaleString('en', { month: 'long', year: 'numeric' })
}
