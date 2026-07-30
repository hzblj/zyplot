import {animation, annotation, fill, halo, interaction, marker, reveal} from '@hzblj/zyplot'
import {isAndroid} from '../platform'
import type {KrakenReading} from './kraken-data'
import {type KrakenScheme, krakenColors} from './kraken-theme'

export const plotInsets = {plotDimensionEndPadding: 24, plotDimensionStartPadding: 0} as const
export const plotStyle = {clip: false} as const

export type PriceDomain = {max: number; min: number}

const DOMAIN_INSET = 0.12

export const priceDomain = (reading: KrakenReading): PriceDomain => {
  const room = (reading.high - reading.low || 1) * DOMAIN_INSET
  return {max: reading.high + room, min: reading.low - room}
}

export const priceAxis = (domain: PriceDomain) => ({domain, visible: false}) as const

const rule = isAndroid ? {dash: [7, 5], width: 1.4} : {dash: [6, 4], width: 1.2}

const grid: Record<KrakenScheme, {dotSize: number; opacity: number}> = {
  dark: {dotSize: 1.1, opacity: 0.5},
  light: {dotSize: 1, opacity: 0.32},
}

const GRID_SPACING = 3.4

const chartStyle = (scheme: KrakenScheme) => {
  const color = krakenColors[scheme]

  return {
    arrival: animation({
      duration: 420,
      easing: 'ease-in-out',
      reveal: reveal.fade({duration: 240}),
      transition: 'morph',
      updates: true,
    }),

    axisRule: (floor: number) =>
      annotation.line({
        axis: 'y',
        color: color.divider,
        id: 'axis',
        value: floor,
        width: 1,
      }),

    latestAnnotation: (reading: KrakenReading) =>
      annotation.line({
        axis: 'y',
        color: color.chartFill,
        dash: rule.dash,
        id: 'latest',
        value: reading.last,
        width: rule.width,
      }),

    latestPoint: (category: string, value: number, isRead: boolean) =>
      annotation.point({
        color: color.trace,
        halo: halo({color: color.chartHalo, size: 17}),
        id: 'now',
        scrubOpacity: isRead ? 1 : 0.45,
        size: 8,
        x: category,
        y: value,
      }),

    scrubbing: (labels: readonly string[]) =>
      interaction({
        crosshair: 'x',
        crosshairStyle: {color: color.chartTrail, labelColor: color.textMuted, labels, width: 1},
        dimOpacity: 0.66,
        haptics: true,
        hover: 'nearest',
        marker: marker.trail({color: color.trace}),
        tooltip: false,
      }),

    traceStyle: {
      fill: fill({
        dotSize: grid[scheme].dotSize,
        fadeTo: 0.12,
        pattern: 'dots' as const,
        spacing: GRID_SPACING,
      }),
      fillOpacity: grid[scheme].opacity,
      strokeWidth: 2.4,
    },
  }
}

export type KrakenChartStyle = ReturnType<typeof chartStyle>

const styles: Record<KrakenScheme, KrakenChartStyle> = {
  dark: chartStyle('dark'),
  light: chartStyle('light'),
}

export const krakenChartStyle = (scheme: KrakenScheme): KrakenChartStyle => styles[scheme]
