import {useSyncExternalStore} from 'react'
import {Appearance, Platform, useColorScheme as useSystemColorScheme} from 'react-native'
import type {ColorScheme} from './tokens'

let chosen: ColorScheme | null = null
const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const setColorScheme = (scheme: ColorScheme) => {
  chosen = scheme
  if (Platform.OS !== 'web') {
    Appearance.setColorScheme(scheme)
  }
  for (const listener of listeners) {
    listener()
  }
}

const getChosen = () => chosen

export const useColorScheme = (): ColorScheme => {
  const system = useSystemColorScheme()
  const override = useSyncExternalStore(subscribe, getChosen, getChosen)
  return override ?? (system === 'dark' ? 'dark' : 'light')
}
