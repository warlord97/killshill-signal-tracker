import { useState, useEffect, useCallback } from 'react'
import { getAllSignals } from '../api/signalApi'
import { REFRESH_INTERVAL } from '../constants'

const useSignals = () => {
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const fetchSignals = useCallback(async () => {
    try {
      setError(null)
      const data = await getAllSignals()
      setSignals(data)
      setLastRefreshed(new Date())
    } catch (err) {
      setError('Failed to fetch signals. Is the server running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSignals()
    const interval = setInterval(fetchSignals, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchSignals])

  return { signals, loading, error, lastRefreshed, refetch: fetchSignals }
}

export default useSignals