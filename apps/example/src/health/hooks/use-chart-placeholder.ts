import {useEffect, useState} from 'react'

export const useChartPlaceholder = (duration = 420) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  return isLoading
}
