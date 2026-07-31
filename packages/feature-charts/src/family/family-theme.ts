export type FamilyScheme = 'dark' | 'light'

export type FamilyColors = {
  background: string
  badge: string
  crosshair: string
  down: string
  mark: string
  pill: string
  pillActive: string
  text: string
  textMuted: string
  trace: string
  up: string
}

const dark: FamilyColors = {
  background: '#000000',
  badge: '#0a84ff',
  crosshair: '#48484a',
  down: '#ebebf0',
  mark: '#2c2c2e',
  pill: '#1c1c1e',
  pillActive: '#2c2c2e',
  text: '#ffffff',
  textMuted: '#8e8e93',
  trace: '#ffffff',
  up: '#32d583',
}

const light: FamilyColors = {
  background: '#ffffff',
  badge: '#0a84ff',
  crosshair: '#c7c7cc',
  down: '#3a3a3c',
  mark: '#e5e5ea',
  pill: '#f2f2f7',
  pillActive: '#e5e5ea',
  text: '#0a0a0c',
  textMuted: '#8a8a8e',
  trace: '#0a0a0c',
  up: '#12a05e',
}

export const familyLayout = {
  avatar: 48,
  badge: 17,
  chartHeight: 208,
  chartTop: 36,
  controlsTop: 20,
  gutter: 20,
  headerGap: 16,
  navButton: 34,
  pill: 36,
  rangeRow: 44,
  readoutTop: 14,
} as const

export const familyColors: Record<FamilyScheme, FamilyColors> = {dark, light}

export type FamilyTheme = {
  color: FamilyColors
  scheme: FamilyScheme
}

export const familyThemes: Record<FamilyScheme, FamilyTheme> = {
  dark: {color: dark, scheme: 'dark'},
  light: {color: light, scheme: 'light'},
}
