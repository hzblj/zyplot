import {axis} from '@hzblj/zyplot'
import type {StocksReading} from './stocks-data'

export type PriceDomain = {max: number; min: number}

/** Room above the high for the top label, which is written against the rule it belongs to. */
const HEADROOM = 0.05

/**
 * The extent of the data, floor pinned to the low. A quote chart's lowest rule is the period's
 * low and its highest is the high, so the trace runs corner to corner and the shape of the
 * period is legible before a single number has been read.
 */
export const priceDomain = (reading: StocksReading): PriceDomain => {
  const low = reading.low === reading.high ? reading.high - 1 : reading.low
  return {max: reading.high + (reading.high - low) * HEADROOM, min: low}
}

/**
 * Four rules down from the high, evenly across the data rather than at round numbers — a
 * price ladder is read as distance from the period's extremes, not as a decimal scale.
 */
export const priceTicks = (domain: PriceDomain) => {
  const high = domain.min + (domain.max - domain.min) / (1 + HEADROOM)
  const step = (high - domain.min) / 4
  return [0, 1, 2, 3].map(index => Math.round(high - step * index))
}

/**
 * The ladder sits in a gutter beside the plot rather than over it. Overlaid labels take no
 * room, which reads as the trace running underneath the prices — and leaves the plot with no
 * right-hand edge to be a box against.
 *
 * The two paddings are the plot's vertical box. Each renderer keeps a reserve of its own above and
 * below the marks, and naming both replaces all three with the same number — a `0` runs the trace
 * corner to corner, which is what a quote chart's does.
 */
export const priceAxis = (domain: PriceDomain) =>
  axis.end({
    domain,
    // The rules are drawn behind the marks by the screen; an axis draws its own over them.
    grid: false,
    labelSize: 13,
    plotDimensionEndPadding: 0,
    plotDimensionStartPadding: 0,
    tickValues: priceTicks(domain),
    visible: true,
  })

/**
 * No labels and no rules of its own. A category axis draws whatever the category is called,
 * and these are called `"0"` … `"119"`, so the five dates go under the plot as text of the
 * screen's own and the five rules go on as annotations — placed on the same ticks either way.
 */
export const timeAxis = {plotDimensionEndPadding: 0, plotDimensionStartPadding: 0, visible: false} as const

/** Where a tick sits across the plot, 0 at the first mark and 1 at the last. */
export const tickPosition = (index: number, slots: number) => index / (slots - 1)

/**
 * The marks are allowed out of the plot: the trace runs to the floor, and the dot under a finger
 * is a mark whose own width hangs past it. The vertical box is the price axis' to name — see
 * `priceAxis` — so nothing here has to know what any renderer reserves.
 */
export const fittedPlot = {clip: false} as const
