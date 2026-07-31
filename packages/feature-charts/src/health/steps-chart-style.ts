import {animation, axis, interaction, reveal} from '@hzblj/zyplot'
import {isAndroid, isWeb} from '../platform'
import type {StepsRange} from './steps-data'
import {type StepsScheme, stepsColors} from './steps-theme'

export const stepsFormat = {decimals: 0, locale: 'en-US'} as const

/**
 * Room for the overlaid y labels, which sit inside the plot against its trailing edge, and a wider
 * inset before the first bar: the labels give the trailing edge its own air, so an equal gutter on
 * the leading edge reads as less.
 */
const plotInsets = {plotDimensionEndPadding: 6, plotDimensionStartPadding: 16} as const

const GRID_LINES = 2

/**
 * Two gridlines and nothing else, at round numbers above the tallest bar — the reader is
 * comparing bars with each other, and a third rule only adds ink.
 */
const stepsAxis = (range: StepsRange) => {
  const tallest = Math.max(...range.values, 1)
  const step = Math.pow(10, Math.floor(Math.log10(tallest)))
  const top = Math.ceil(tallest / step) * step
  return axis.overlay({
    domain: {max: top, min: 0},
    format: stepsFormat,
    grid: true,
    labelInset: 4,
    labelSize: 13,
    ticks: false,
    tickValues: Array.from({length: GRID_LINES}, (_, index) => (top * (index + 1)) / GRID_LINES),
  })
}

const chartStyle = (scheme: StepsScheme) => {
  const color = stepsColors[scheme]

  return {
    /**
     * Bars grow rather than trace: a bar chart has no direction to be drawn along.
     *
     * Switching range plays that entrance again on the new bars, and no `transition`, so the old
     * ones are simply gone. A month of thirty bars and a week of seven have no pairs to morph
     * between, and holding the outgoing set on screen to dissolve it reads as two charts at once
     * rather than as one chart changing. No `delay` either: a range switch is a tap being
     * answered, and the wait that suits a pushed screen reads as a stall here.
     */
    arrival: animation({
      duration: isWeb ? 300 : 460,
      easing: 'ease-in-out',
      reveal: reveal.fade({duration: isWeb ? 300 : 460}),
      updates: true,
    }),

    barStyle: {color: color.bar},

    /**
     * A span is the reading this screen is for, so both fingers and one are on. The crosshair
     * style dresses the single rule and the pair of them alike.
     *
     * The tooltip is the chart's own card, which the headline replaces on native. It stays on
     * the web, where `Chart.Bar` reports no scrub of its own for a headline to follow.
     */
    reading: interaction({
      crosshair: 'x',
      crosshairStyle: {color: color.rule, width: isAndroid ? 1.2 : 1},
      haptics: true,
      range: true,
      tooltip: isWeb,
    }),

    theme: {
      colors: {grid: color.grid, label: color.label},
    },

    valueAxis: stepsAxis,

    /**
     * The dates are named rather than left to the renderer, and the gap under them is too: each
     * renderer keeps a spacing of its own — Swift Charts is the tightest of the three — so the row
     * sat at a different distance on every platform. Naming it puts all three on the same number.
     */
    xAxis: (range: StepsRange) => ({
      ...plotInsets,
      grid: false,
      labelInset: 6,
      labelSize: 13,
      ticks: false,
      tickValues: range.ticks,
    }),
  }
}

export type StepsChartStyle = ReturnType<typeof chartStyle>

const styles: Record<StepsScheme, StepsChartStyle> = {
  dark: chartStyle('dark'),
  light: chartStyle('light'),
}

export const stepsChartStyle = (scheme: StepsScheme): StepsChartStyle => styles[scheme]
