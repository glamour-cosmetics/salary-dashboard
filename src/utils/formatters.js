/**
 * Format a number as UZS currency
 * @param {number} amount
 * @param {string} currency
 */
export function formatCurrency(amount, currency = 'UZS') {
  return new Intl.NumberFormat('uz-UZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' ' + currency
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
