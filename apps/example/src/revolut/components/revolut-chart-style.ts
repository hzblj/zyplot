import {animation, annotation, axis, glow, halo, interaction, marker, reveal} from '@hzblj/zyplot'
import {Platform} from 'react-native'
import type {QuoteRange} from '../data/quote-data'
import {type QuoteScheme, quoteColors} from '../data/quote-theme'

export const priceFormat = {decimals: 2, locale: 'en-US'} as const

/**
 * iOS reads right at a hairline; Android's rules sit heavier here on purpose. Both rules —
 * the horizontal baseline and the vertical event — take the same treatment.
 */
const rule = Platform.select({
  android: {baselineDash: [2, 5], eventDash: [3, 5], width: 1.2},
  default: {baselineDash: [1, 4], eventDash: [2, 4], width: 1},
})

export type PriceDomain = {max: number; min: number}

/**
 * The overlay axis draws its labels inside the plot, so the trace has to stop short of them
 * — `labelInset` would only pull the labels further in, towards the line.
 */
export const plotInsets = {plotDimensionEndPadding: 22, plotDimensionStartPadding: 8} as const

/**
 * No `backgroundColor` here: on iOS the plot's background paints over `chartBackground`,
 * which is where the line and its glow are drawn. It is also what lets the chart take the
 * OS mode on its own, rather than us painting a colour under it per scheme.
 */
export const plotStyle = {clip: false} as const

/**
 * Room above and below the trace. Without it a range whose extreme is its first value —
 * `max` opens at its own low — puts that point on the plot's floor, and half the stroke
 * plus its glow falls outside. The labels stay on the real numbers.
 */
const DOMAIN_INSET = 0.09

export const priceAxis = (domain: PriceDomain) => {
  const room = (domain.max - domain.min || 1) * DOMAIN_INSET
  return axis.overlay({
    domain: {max: domain.max + room, min: domain.min - room},
    format: priceFormat,
    grid: false,
    labelInset: 22,
    labelSize: 13,
    ticks: false,
    tickValues: [domain.min, domain.max],
  })
}

type Bloom = {
  candle: {opacity: number; radius: number}
  flash: {glow: number; opacity: number}
  live: {opacity: number; radius: number}
  pulse: {opacity: number; scale: number}
  scrub: {opacity: number; radius: number}
  trace: {opacity: number; radius: number}
}

/**
 * How far each bloom reaches and how hard it lands. On black a glow reads as light coming
 * off the mark; on white the same numbers read as ink smudged into the page — a 42 pt red
 * bloom behind the crosshair covers half the plot in pink. So light pulls every radius in
 * and every opacity down until each bloom hugs the mark it belongs to, and leans on the
 * mark's own contrast against the paper for the rest. Only the numbers live here; the
 * colours stay in the palette.
 */
const blooms: Record<QuoteScheme, Bloom> = {
  dark: {
    candle: {opacity: 0.26, radius: 22},
    flash: {glow: 3.4, opacity: 0.85},
    live: {opacity: 0.25, radius: 4},
    pulse: {opacity: 0.7, scale: 2.9},
    scrub: {opacity: 0.32, radius: 42},
    trace: {opacity: 0.16, radius: 7},
  },
  light: {
    candle: {opacity: 0.1, radius: 9},
    flash: {glow: 1.2, opacity: 0.45},
    live: {opacity: 0.14, radius: 3},
    pulse: {opacity: 0.32, scale: 2.2},
    scrub: {opacity: 0.11, radius: 13},
    trace: {opacity: 0.09, radius: 3},
  },
}

/**
 * Everything the chart is told that carries a colour, resolved for one scheme. Building it
 * per scheme rather than per render keeps each preset a single object the charts can hold:
 * `animation` and `interaction` are compared by identity on the way to the native side.
 */
const chartStyle = (scheme: QuoteScheme) => {
  const color = quoteColors[scheme]
  const bloom = blooms[scheme]
  const isDark = scheme === 'dark'

  return {
    arrival: animation({
      // Navigation lands before the chart does: the delay keeps the trace from starting under
      // the push transition, where the first third of it is never seen.
      delay: 160,
      reveal: reveal.draw({
        duration: 560,
        flashColor: color.chartFlash,
        flashDuration: 560,
        // The glow holds a beat once the trace lands and then leaves in one piece, which
        // `ease-in-out` gives us — the default `ease-out` sheds most of it in the first frames,
        // so it read as fading away while the trace was still arriving.
        flashEasing: 'ease-in-out',
        flashGlow: bloom.flash.glow,
        flashHold: 260,
        flashOpacity: bloom.flash.opacity,
        startOpacity: 0.5,
        trackColor: color.chartTrack,
        trackOpacity: 0.4,
      }),
      updates: false,
    }),

    baselineAnnotation: (range: QuoteRange) =>
      annotation.line({
        axis: 'y',
        color: color.label,
        dash: rule.baselineDash,
        id: 'baseline',
        label: range.baselineLabel,
        labelBackground: color.background,
        labelPosition: 'auto',
        scrubOpacity: 0,
        value: range.baseline,
        width: rule.width,
      }),

    /**
     * One slot wide where the line's marker is two, and with a tighter bloom: a two-slot span
     * sits between candles rather than on the one being read, and the line's glow reaches far
     * enough to smear halfway across a plot this densely packed.
     */
    candleMarker: marker.segment({
      color: color.chartMark,
      glow: glow({color: color.down, ...bloom.candle}),
      span: 1,
    }),

    eventAnnotations: (range: QuoteRange) =>
      range.event
        ? [
            // No `badge` here on purpose: the app draws its own over the plot, positioned from
            // the geometry the chart reports. See quote-chart-overlay.tsx.
            annotation.line({
              axis: 'x',
              color: color.label,
              dash: rule.eventDash,
              id: 'event',
              labelPosition: 'top',
              size: 18,
              value: range.event.category,
              width: rule.width,
            }),
          ]
        : [],

    /**
     * The dot on the last reading of the intraday range. The rhythm is slower and rests
     * longer than the default, which reads as nothing at all on a dot this small.
     */
    liveAnnotation: (point: {category: string; value: number}) =>
      annotation.point({
        color: color.chartLive,
        glow: glow({color: color.down, ...bloom.live}),
        halo: halo({color: color.chartLiveHalo, size: 15}),
        id: 'live',
        pulse: {duration: 520, interval: 1480, ...bloom.pulse},
        size: 6.5,
        x: point.category,
        y: point.value,
      }),

    scrubbing: interaction({
      crosshair: 'x',
      crosshairStyle: {color: color.chartMark, width: 1},
      // A mark steps back further on black than on white: fading towards paper washes a
      // candle out long before fading towards ink does, and the ones not being read are
      // still data the reader is comparing against.
      dimOpacity: isDark ? 0.38 : 0.62,
      haptics: true,
      // Lifted towards white but only halfway, so the candle's own red or green still reads.
      // Towards ink the same distance would take a red candle almost to black, so light
      // blends less far.
      highlightBlend: isDark ? 0.5 : 0.32,
      highlightColor: color.chartMark,
      hover: 'nearest',
    }),

    scrubMarker: marker.segment({
      color: color.chartScrub,
      glow: glow({color: color.down, ...bloom.scrub}),
      span: 2,
    }),

    theme: {colors: {label: color.label}},

    /** The price line itself. Its glow takes the series colour, so only the numbers vary. */
    traceStyle: {glow: glow(bloom.trace), strokeWidth: 2.3},
  }
}

export type QuoteChartStyle = ReturnType<typeof chartStyle>

const styles: Record<QuoteScheme, QuoteChartStyle> = {
  dark: chartStyle('dark'),
  light: chartStyle('light'),
}

/** Stable per scheme, so it can sit in a `useMemo`'s dependencies. */
export const quoteChartStyle = (scheme: QuoteScheme): QuoteChartStyle => styles[scheme]
