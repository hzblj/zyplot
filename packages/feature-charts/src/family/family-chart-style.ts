import {animation, annotation, type ChartReading, glow, interaction, marker, reveal} from '@hzblj/zyplot'
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

export const plotStyle = {clip: false} as const

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

const chartStyle = (scheme: FamilyScheme) => {
  const color = familyColors[scheme]
  const isDark = scheme === 'dark'

  return {
    /**
     * The placeholder curve is the same line with different values, so the data does not arrive —
     * the resting wave becomes it. `'morph'` is what interpolates the two on native; the web
     * renderer moves mark by mark on its own, so long as the slots keep the names they had.
     */
    arrival: animation({
      duration: familyTiming.morph,
      easing: 'ease-in-out',
      reveal: reveal.draw({duration: familyTiming.draw, easing: 'ease-in-out'}),
      transition: 'morph',
      updates: true,
    }),

    liveAnnotation: (reading: ChartReading) =>
      annotation.point({
        color: color.trace,
        glow: glow({color: color.trace, opacity: isDark ? 0.3 : 0.16, radius: 6}),
        id: 'live',
        pulse: {duration: 620, interval: 1580, opacity: isDark ? 0.55 : 0.3, scale: 2.4},
        scrubOpacity: isDark ? 0.34 : 0.5,
        size: 7,
        x: reading.category,
        y: reading.value,
      }),

    /**
     * What the plot rests at while the placeholder wave is up. Lower than the dim a scrub falls to,
     * and lower in light than in dark: a dark trace over white holds its weight as it thins out, so
     * matching dark's number leaves the placeholder looking like the answer and the fade like nothing
     * happened. Both schemes rest at about a third of the ink they land on.
     */
    resting: isDark ? 0.34 : 0.3,

    /**
     * The story so far stays lit and the rest of the window steps back, so the reading needs no
     * tooltip. Everything the finger drags is the chart's to draw — the chip above the crosshair
     * and `dot` at the head of the trail — because a view fed from a scrub handler has to cross
     * into JavaScript and back before it moves, and arrives after the finger has gone.
     */
    scrubbing: (stamps: readonly string[]) =>
      interaction({
        crosshair: 'x',
        crosshairStyle: {
          color: color.crosshair,
          labelBackground: color.pillActive,
          labelColor: color.textMuted,
          labelLift: 2,
          labelPadding: {x: 12, y: 5},
          labels: stamps,
          width: 1,
        },
        dimDuration: familyTiming.dim,
        dimOpacity: isDark ? 0.34 : 0.5,
        haptics: true,
        highlightColor: color.trace,
        hover: 'nearest',
        marker: marker.trail({
          color: color.trace,
          dot: true,
          glow: glow({color: color.trace, opacity: isDark ? 0.16 : 0.08, radius: 7}),
          size: 11,
        }),
        tooltip: false,
      }),

    theme: {colors: {label: color.textMuted}},

    traceStyle: {glow: glow({opacity: isDark ? 0.18 : 0.08, radius: 7}), strokeWidth: 3},
  }
}

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
