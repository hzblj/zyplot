export type QuoteScheme = 'dark' | 'light'

export type QuoteColors = {
  background: string
  card: string
  chartFlash: string
  chartLive: string
  chartLiveHalo: string
  chartMark: string
  chartScrub: string
  chartTrack: string
  down: string
  label: string
  pill: string
  pillActive: string
  pillPressed: string
  statusChip: string
  statusChipText: string
  text: string
  textMuted: string
  up: string
}

const dark: QuoteColors = {
  background: '#000000',
  card: '#161618',
  chartFlash: '#ffe3e8',
  chartLive: '#ffffff',
  chartLiveHalo: '#ff4857',
  chartMark: '#ffffff',
  chartScrub: '#ffffff',
  chartTrack: '#8a8a8a',
  down: '#ff4857',
  label: '#979699',
  pill: '#181818',
  pillActive: '#3e3e3e',
  pillPressed: '#3e3e3e',
  statusChip: '#3a2a12',
  statusChipText: '#f5b544',
  text: '#f2f2f2',
  textMuted: '#666666',
  up: '#2ad17e',
}

const light: QuoteColors = {
  background: '#ffffff',
  card: '#f4f4f6',
  chartFlash: '#ff7a8c',
  chartLive: '#e5253a',
  chartLiveHalo: '#ffc2ca',
  chartMark: '#0a0a0c',
  chartScrub: '#e5253a',
  chartTrack: '#b4b4bd',
  down: '#e5253a',
  label: '#6f6f76',
  pill: '#f1f1f3',
  pillActive: '#ffffff',
  pillPressed: '#e4e4e8',
  statusChip: '#fdf1d8',
  statusChipText: '#a06a05',
  text: '#0a0a0c',
  textMuted: '#77777e',
  up: '#0f9d58',
}

export const quoteLayout = {
  chartHeight: 180,
  chartTop: 53,
  controlHeight: 36,
  controlsTop: 22,
  gutter: 16,
  headerGap: 18,
  navButton: 44,
  readoutTop: 16,
  statusSurface: 22,
} as const

export const quoteColors: Record<QuoteScheme, QuoteColors> = {dark, light}

export type QuoteTheme = {
  color: QuoteColors
  scheme: QuoteScheme
}

export const quoteThemes: Record<QuoteScheme, QuoteTheme> = {
  dark: {color: dark, scheme: 'dark'},
  light: {color: light, scheme: 'light'},
}
