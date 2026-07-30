export type KrakenScheme = 'dark' | 'light'

export type KrakenColors = {
  background: string
  card: string
  divider: string
  chartFill: string
  chartHalo: string
  chartTrail: string
  fillSolid: string
  down: string
  noteChip: string
  noteChipText: string
  onSolid: string
  pill: string
  pillActive: string
  pillPressed: string
  text: string
  textFaint: string
  textMuted: string
  trace: string
  up: string
}

const light: KrakenColors = {
  background: '#fafafa',
  card: '#ffffff',
  chartFill: '#f5901f',
  chartHalo: '#fce4cb',
  chartTrail: '#f8b877',
  divider: '#e6e6e6',
  down: '#d5122a',
  fillSolid: '#111114',
  noteChip: '#e4f6ea',
  noteChipText: '#0a8043',
  onSolid: '#ffffff',
  pill: '#ededee',
  pillActive: '#ffffff',
  pillPressed: '#e0e0e2',
  text: '#1a1a1a',
  textFaint: '#b8b8b8',
  textMuted: '#8e8e93',
  trace: '#f48415',
  up: '#0a8043',
}

const dark: KrakenColors = {
  background: '#08080a',
  card: '#131317',
  chartFill: '#f9a441',
  chartHalo: '#4a3218',
  chartTrail: '#7a5730',
  divider: '#232329',
  down: '#ff5566',
  fillSolid: '#f5f5f7',
  noteChip: '#0f2c1e',
  noteChipText: '#2ecc8f',
  onSolid: '#08080a',
  pill: '#1a1a1f',
  pillActive: '#2c2c34',
  pillPressed: '#2c2c34',
  text: '#f5f5f7',
  textFaint: '#4f4f57',
  textMuted: '#86868c',
  trace: '#f89b3c',
  up: '#2ecc8f',
}

export const krakenLayout = {
  cardRadius: 18,
  chartHeight: 172,
  chartTop: 40,
  circleButton: 40,
  extremesBottom: 14,
  extremesTop: 14,
  gutter: 16,
  navHeight: 44,
  pillHeight: 38,
  readoutTop: 14,
  rowHeight: 68,
  rule: 1,
  sparkline: {height: 34, width: 88},
  tabs: {height: 44, underline: {height: 2, width: 28}},
} as const

export const krakenColors: Record<KrakenScheme, KrakenColors> = {dark, light}

export type KrakenTheme = {
  color: KrakenColors
  scheme: KrakenScheme
}

export const krakenThemes: Record<KrakenScheme, KrakenTheme> = {
  dark: {color: dark, scheme: 'dark'},
  light: {color: light, scheme: 'light'},
}
