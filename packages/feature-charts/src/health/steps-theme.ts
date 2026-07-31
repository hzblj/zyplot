export type StepsScheme = 'dark' | 'light'

export type StepsColors = {
  background: string
  bar: string
  card: string
  grid: string
  label: string
  rule: string
  segment: string
  segmentActive: string
  text: string
  textMuted: string
}

const dark: StepsColors = {
  background: '#000000',
  bar: '#ff4d12',
  card: '#2c2c2e',
  grid: '#3a3a3c',
  label: '#8e8e93',
  rule: '#8e8e93',
  segment: '#1c1c1e',
  segmentActive: '#48484a',
  text: '#ffffff',
  textMuted: '#8e8e93',
}

const light: StepsColors = {
  background: '#ffffff',
  bar: '#f2470d',
  card: '#f2f2f7',
  grid: '#d1d1d6',
  label: '#8a8a8e',
  rule: '#8a8a8e',
  segment: '#efeff0',
  segmentActive: '#ffffff',
  text: '#000000',
  textMuted: '#8a8a8e',
}

export const stepsLayout = {
  chartHeight: 240,
  chartTop: 8,
  gutter: 20,
  navButton: 36,
  readoutTop: 14,
  segmentHeight: 32,
  segmentTop: 10,
} as const

export const stepsColors: Record<StepsScheme, StepsColors> = {dark, light}

export type StepsTheme = {
  color: StepsColors
  scheme: StepsScheme
}

export const stepsThemes: Record<StepsScheme, StepsTheme> = {
  dark: {color: dark, scheme: 'dark'},
  light: {color: light, scheme: 'light'},
}
