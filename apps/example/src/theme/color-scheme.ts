import {useSyncExternalStore} from 'react'
import {Appearance, Platform, useColorScheme as useSystemColorScheme} from 'react-native'
import type {ColorScheme} from './tokens'

let chosen: ColorScheme | null = null

const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * Flips the appearance of the whole app.
 *
 * `Appearance.setColorScheme` is what reaches the parts of the app React does not paint —
 * the native stack header, the SwiftUI and Compose hosts, the window behind them — so on a
 * device one call repaints everything rather than only the views that read our tokens.
 * React Native Web has no such setter, so the choice is also kept here, where every hook
 * that reads the scheme can see it. Until it is called, the OS setting decides.
 */
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

/** The scheme in force: the one that was chosen, or the OS setting while none has been. */
export const useColorScheme = (): ColorScheme => {
  const system = useSystemColorScheme()
  const override = useSyncExternalStore(subscribe, getChosen, getChosen)
  return override ?? (system === 'dark' ? 'dark' : 'light')
}
