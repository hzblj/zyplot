import {animation, annotation, axis, fill, halo, interaction, marker, theme} from '@hzblj/zyplot'
import type {StocksReading} from './stocks-data'
import {type StocksScheme, stocksColors} from './stocks-theme'

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

export const hiddenAxis = {plotDimensionEndPadding: 0, plotDimensionStartPadding: 0, visible: false} as const

/**
 * The marks are allowed out of the plot: the trace runs to the floor, and the dot under a finger
 * is a mark whose own width hangs past it. The vertical box is the price axis' to name — see
 * `priceAxis` — so nothing here has to know what any renderer reserves.
 */
export const fittedPlot = {clip: false} as const

const chartStyle = (scheme: StocksScheme) => {
  const color = stocksColors[scheme]

  return {
    /**
     * Nothing moves that the data did not. The sheet opens on a price that is already true, and
     * a tap on another range is a request to see that range — not to watch a month become a
     * year. Both would be the chart telling a story of its own.
     */
    arrival: animation({enabled: false, initial: false, updates: false}),

    /**
     * Two marks at the ends of the data that nobody draws. The chart still measures them and
     * reports where they landed, which is the only exact answer to where the plot's sides are:
     * a rule reports through the axis rather than through the marks, and the two do not agree
     * on the web.
     */
    edge: (id: string, category: string, value: number) =>
      annotation.point({color: color.sheet, hidden: true, id, size: 0, x: category, y: value}),

    /** The scale's own rules, so the four across match the five down the plot draws itself. */
    grid: theme({colors: {axis: color.chartGrid, grid: color.chartGrid, label: color.textMuted}}),

    scrubbing: interaction({
      crosshair: 'x',
      crosshairStyle: {color: color.scrub, width: 1},
      // There is only ever one trace, and it takes the reading colour whole while a finger is
      // down, so nothing steps back — a dimmed line under a crosshair reads as disabled.
      dimOpacity: 1,
      haptics: true,
      hover: 'nearest',
      marker: marker.point({color: color.scrub, size: 15}),
      range: true,
      /**
       * Two fingers are a different reading: the stretch between them is painted in its own
       * direction and the rest of the period steps back behind it. The chart draws all of it from
       * the fingers, so the ends do not have to come back through a scrub handler to move.
       */
      rangeStyle: {color: color.up, dimOpacity: 0.32, dot: true, downColor: color.down},
      tooltip: false,
    }),

    /**
     * The dot under one finger, for the web alone: its scrub overlay draws a crosshair and
     * skips a `'point'` marker, so the reading would otherwise have a line and no mark.
     */
    scrubPoint: (category: string, value: number) =>
      annotation.point({
        color: color.scrub,
        halo: halo({color: color.sheet, size: 21}),
        id: 'scrub',
        size: 15,
        x: category,
        y: value,
      }),

    /** Gathers under the trace and lets go of the floor, the way a quote chart's fill does. */
    traceStyle: {fill: fill({fadeTo: 0.06}), fillOpacity: 0.42, strokeWidth: 2},
  }
}

export type StocksChartStyle = ReturnType<typeof chartStyle>

const styles: Record<StocksScheme, StocksChartStyle> = {
  dark: chartStyle('dark'),
  light: chartStyle('light'),
}

export const stocksChartStyle = (scheme: StocksScheme): StocksChartStyle => styles[scheme]
