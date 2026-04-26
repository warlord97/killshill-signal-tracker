// Format price with commas and decimals
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

// Format ROI with + or - sign
export const formatROI = (roi) => {
  if (roi === null || roi === undefined) return '—'
  const sign = roi >= 0 ? '+' : ''
  return `${sign}${parseFloat(roi).toFixed(2)}%`
}

// Format date to readable string
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// Time remaining until expiry
export const getTimeRemaining = (expiryTime) => {
  const now = new Date()
  const expiry = new Date(expiryTime)
  const diff = expiry - now

  if (diff <= 0) return 'Expired'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}