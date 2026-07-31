import {useEffect, useState} from 'react'

/** Long enough to read the placeholder, which is the point of this screen. */
export const useChartPlaceholder = (duration = 900) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  return isLoading
}
