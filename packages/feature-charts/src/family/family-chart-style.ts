import {isAndroid, isWeb} from '../platform'
import {type FamilyRangeId, familyWave} from './family-data'
import {type FamilyScheme, familyColors} from './family-theme'

/**
 * Half the native timing on the web for anything a pointer drives — a pointer lands on the trace long
 * before a thumb would. The arrival fade goes with it, and on the web it does not wait for the morph
 * either: a fade still running after the window has landed reads as lag rather than as an arrival.
 */
export const familyTiming = isWeb
  ? {dim: 420, draw: 420, fade: 200, fadeDelay: 0, morph: 260}
  : {dim: 420, draw: 620, fade: 800, fadeDelay: 180, morph: 360}

const BAND_INSET = isAndroid ? 0 : isWeb ? -6 : -4

/** The windows short enough to end at now, and so the only ones that end at the live dot. */
export const hasLiveDot = (id: FamilyRangeId) => id === '1h' || id === '1d'

/**
 * The window runs the full width of the screen and off both edges. iOS and the web centre a mark in
 * its band, which starts the trace half a band inside the screen until the padding hands that back;
 * Android already draws a line through the plot's own corners, so there it hands back nothing. The
 * windows that close on the live dot need no gutter cut out for it: their room is in the domain, as
 * the empty slots the axis keeps for the rest of the period, so the ring and its glow land inside.
 */
export const plotInsets = {
  plotDimensionEndPadding: BAND_INSET,
  plotDimensionStartPadding: BAND_INSET,
} as const

const DOMAIN_INSET = 0.12

export type PriceDomain = {max: number; min: number}

/** Room above and below the window, so the trace reads as a price and not as clipped. */
export const priceDomain = (values: readonly number[]): PriceDomain => {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const room = (max - min || 1) * DOMAIN_INSET
  return {max: max + room, min: min - room}
}

/** What the chip above the crosshair says: the moment being read, and that the last one is now. */
export const familyStamps = (stamps: readonly string[]) => [...stamps.slice(0, -1), 'LIVE']

const chartStyle = (scheme: FamilyScheme) => ({
  /**
   * What the plot rests at while the placeholder wave is up. Lower than the dim a scrub falls to,
   * and lower in light than in dark: a dark trace over white holds its weight as it thins out, so
   * matching dark's number leaves the placeholder looking like the answer and the fade like nothing
   * happened. Both schemes rest at about a third of the ink they land on.
   */
  resting: scheme === 'dark' ? 0.34 : 0.3,

  theme: {colors: {label: familyColors[scheme].textMuted}},
})

const WAVE_HEIGHT = 0.42

/** The resting curve, laid in the window's own domain so only the values change when the data lands. */
export const waveValues = (domain: PriceDomain) => {
  const middle = (domain.max + domain.min) / 2
  const amplitude = ((domain.max - domain.min) / 2) * WAVE_HEIGHT
  return familyWave.map(level => middle + level * amplitude)
}

export type FamilyChartStyle = ReturnType<typeof chartStyle>

const styles: Record<FamilyScheme, FamilyChartStyle> = {
  dark: chartStyle('dark'),
  light: chartStyle('light'),
}

export const familyChartStyle = (scheme: FamilyScheme): FamilyChartStyle => styles[scheme]
