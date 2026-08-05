import {zyplot} from '@hzblj/zyplot'
import {isWeb} from '../platform'
import type {StepsRange} from './steps-data'
import {type StepsScheme, stepsColors} from './steps-theme'

export const stepsFormat = {decimals: 0, locale: 'en-US'} as const

/**
 * Room for the overlaid y labels, which sit inside the plot against its trailing edge, and a wider
 * inset before the first bar: the labels give the trailing edge its own air, so an equal gutter on
 * the leading edge reads as less.
 */
export const plotInsets = {plotDimensionEndPadding: 6, plotDimensionStartPadding: 16} as const

const GRID_LINES = 2

/**
 * Two gridlines and nothing else, at round numbers above the tallest bar — the reader is
 * comparing bars with each other, and a third rule only adds ink.
 */
export const stepsScale = (range: StepsRange) => {
  const tallest = Math.max(...range.values, 1)
  const step = Math.pow(10, Math.floor(Math.log10(tallest)))
  const top = Math.ceil(tallest / step) * step

  return {
    domain: {max: top, min: 0},
    tickValues: Array.from({length: GRID_LINES}, (_, index) => (top * (index + 1)) / GRID_LINES),
  }
}

/**
 * Bars grow rather than trace: a bar chart has no direction to be drawn along. The cumulative
 * card takes the same entrance, which is why it is a preset rather than written into either chart.
 *
 * Switching range plays that entrance again on the new bars, and no `transition`, so the old ones
 * are simply gone. A month of thirty bars and a week of seven have no pairs to morph between, and
 * holding the outgoing set on screen to dissolve it reads as two charts at once rather than as one
 * chart changing. No `delay` either: a range switch is a tap being answered, and the wait that
 * suits a pushed screen reads as a stall here.
 */
export const stepsArrival = zyplot(z => ({
  animation: z.animation({
    duration: isWeb ? 300 : 460,
    easing: 'ease-in-out',
    reveal: z.reveal.fade({duration: isWeb ? 300 : 460}),
    updates: true,
  }),
}))

const chartStyle = (scheme: StepsScheme) => ({
  theme: {colors: {grid: stepsColors[scheme].grid, label: stepsColors[scheme].label}},
})

export type StepsChartStyle = ReturnType<typeof chartStyle>

const styles: Record<StepsScheme, StepsChartStyle> = {
  dark: chartStyle('dark'),
  light: chartStyle('light'),
}

export const stepsChartStyle = (scheme: StepsScheme): StepsChartStyle => styles[scheme]
