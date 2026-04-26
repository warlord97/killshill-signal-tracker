import { useState, useEffect } from 'react'
import { getTimeRemaining } from '../utils/formatters'

const useCountdown = (expiryTime) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(expiryTime))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(expiryTime))
    }, 60000) // update every minute

    return () => clearInterval(timer)
  }, [expiryTime])

  return timeLeft
}

export default useCountdown