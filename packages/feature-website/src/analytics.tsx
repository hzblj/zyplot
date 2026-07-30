'use client'

import {useEffect} from 'react'

declare global {
  interface Window {
    gtag?: (command: 'event', name: string, params?: Record<string, string>) => void
  }
}

export const AnalyticsEvents = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-analytics]')
      const name = target?.dataset.analytics

      if (!name) {
        return
      }

      const params: Record<string, string> = {}

      for (const [key, value] of Object.entries(target.dataset)) {
        if (key === 'analytics' || !value) {
          continue
        }

        if (key.startsWith('analytics')) {
          params[
            key
              .slice('analytics'.length)
              .replace(/^[A-Z]/, first => first.toLowerCase())
              .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
          ] = value
        }
      }

      window.gtag?.('event', name, params)
    }

    document.addEventListener('click', onClick)

    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
