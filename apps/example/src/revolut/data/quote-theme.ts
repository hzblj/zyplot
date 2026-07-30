import {useColorScheme} from '../../theme/color-scheme'

export type QuoteScheme = 'dark' | 'light'

export type QuoteColors = {
  /** The page, and the plate an annotation label is punched out of. */
  background: string
  /** The reading card the overlay draws over the plot. */
  card: string
  /** The bloom that runs along the trace as it is drawn. */
  chartFlash: string
  /** The dot on the last intraday reading. */
  chartLive: string
  /** The ring it sits in, which is also what pulses out of it. */
  chartLiveHalo: string
  /** Crosshair and candle highlight — the marks the plot puts over the data. */
  chartMark: string
  /** The stretch of line under the finger, while the rest of the trace is dimmed. */
  chartScrub: string
  /** The path the trace has not reached yet. */
  chartTrack: string
  down: string
  /** Axis labels and the rules the chart draws through the plot. */
  label: string
  /** A control's own surface: the tab pill, the range track, a circle button. */
  pill: string
  /** The selected item lifted off that surface. */
  pillActive: string
  /** A circle button under the finger or the cursor. */
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

/**
 * Not the dark set inverted channel by channel. Two places take a different shape rather
 * than a different value: a control's surface goes grey and its selected item goes white,
 * where dark does the reverse, and the marks over the plot go to ink instead of to paper.
 * Red and green are pulled down towards their darker ends, which is what keeps them
 * legible on white without reading as different colours.
 */
const light: QuoteColors = {
  background: '#ffffff',
  card: '#f4f4f6',
  // Deeper than dark's near-white pink: the flash has to be seen against the paper, not
  // added to it. What keeps it soft is the reach and the peak, in `blooms`.
  chartFlash: '#ff7a8c',
  // Dark puts a paper-coloured dot in a red ring. Ink in a red ring is a smudge, so light
  // turns it around: the dot takes the trace's own red and the ring goes pale behind it.
  chartLive: '#e5253a',
  chartLiveHalo: '#ffc2ca',
  chartMark: '#0a0a0c',
  // Ink over a dimmed trace reads as a scribble on the paper, so light keeps the stretch
  // being read in the trace's own red and lets the dimming around it do the pointing.
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

/** Geometry, which both schemes share. */
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

const themes: Record<QuoteScheme, QuoteTheme> = {
  dark: {color: dark, scheme: 'dark'},
  light: {color: light, scheme: 'light'},
}

/**
 * Follows the app's scheme — the OS setting until the toolbar's switch is pressed. The
 * `scheme` rides along because the parts of the screen that are not ours to colour — the
 * SwiftUI picker, the web charts' own CSS variables — take a mode rather than a palette.
 */
export const useQuoteTheme = (): QuoteTheme => themes[useColorScheme()]
