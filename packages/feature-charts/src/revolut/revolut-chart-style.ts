import {animation, annotation, axis, glow, halo, interaction, marker, reveal} from '@hzblj/zyplot'
import {isAndroid, isWeb} from '../platform'
import type {QuoteRange} from './quote-data'
import {type QuoteScheme, quoteColors} from './quote-theme'

export const priceFormat = {decimals: 2, locale: 'en-US'} as const

const rule = isAndroid
  ? {baselineDash: [2, 5], eventDash: [3, 5], width: 1.2}
  : {baselineDash: [1, 4], eventDash: [2, 4], width: 1}

/** Half the native timing on the web: a pointer lands on the trace long before a thumb would. */
const arrivalTiming = isWeb
  ? {delay: 80, duration: 280, flashDuration: 280, flashHold: 130}
  : {delay: 160, duration: 560, flashDuration: 560, flashHold: 260}

export type PriceDomain = {max: number; min: number}

export const plotInsets = {plotDimensionEndPadding: 22, plotDimensionStartPadding: 8} as const
export const plotStyle = {clip: false} as const
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

const chartStyle = (scheme: QuoteScheme) => {
  const color = quoteColors[scheme]
  const bloom = blooms[scheme]
  const isDark = scheme === 'dark'

  return {
    arrival: animation({
      delay: arrivalTiming.delay,
      reveal: reveal.draw({
        duration: arrivalTiming.duration,
        flashColor: color.chartFlash,
        flashDuration: arrivalTiming.flashDuration,
        flashEasing: 'ease-in-out',
        flashGlow: bloom.flash.glow,
        flashHold: arrivalTiming.flashHold,
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

    candleMarker: marker.segment({
      color: color.chartMark,
      glow: glow({color: color.down, ...bloom.candle}),
      span: 1,
    }),

    eventAnnotations: (range: QuoteRange, hasBadge = false) =>
      range.event
        ? [
            annotation.line({
              axis: 'x',
              badge: hasBadge ? range.event.badge : undefined,
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
      dimOpacity: isDark ? 0.38 : 0.62,
      haptics: true,
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

    traceStyle: {glow: glow(bloom.trace), strokeWidth: 2.3},
  }
}

export type QuoteChartStyle = ReturnType<typeof chartStyle>

const styles: Record<QuoteScheme, QuoteChartStyle> = {
  dark: chartStyle('dark'),
  light: chartStyle('light'),
}

export const quoteChartStyle = (scheme: QuoteScheme): QuoteChartStyle => styles[scheme]
