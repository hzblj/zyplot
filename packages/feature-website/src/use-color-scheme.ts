'use client'

import {useSyncExternalStore} from 'react'

/** Follows the `dark` class the theme script and the toggle write on `<html>`. */
export const useColorScheme = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {attributeFilter: ['class']})
  return () => observer.disconnect()
}

const getSnapshot = (): 'dark' | 'light' => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

const getServerSnapshot = (): 'dark' | 'light' => 'light'
