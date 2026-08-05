'use client'

import {useEffect} from 'react'
import {applyTheme, resolvedTheme} from './theme'

/**
 * Keeps the root honest after the first paint: the OS switching while no choice is pinned, and a
 * choice another tab wrote into the cookie. Renders nothing.
 */
export const ThemeSync = () => {
  useEffect(() => {
    const sync = () => applyTheme(resolvedTheme())
    const media = matchMedia('(prefers-color-scheme: dark)')

    sync()
    media.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)

    return () => {
      media.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return null
}
