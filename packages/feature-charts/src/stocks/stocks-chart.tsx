import {Chart, type ChartGeometry, type ChartInteractionHandler, type ChartSlotViewProps, zyplot} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import {fittedPlot, priceAxis, priceDomain, priceTicks, timeAxis} from './stocks-chart-style'
import {type StocksRange, stocksCategories, stocksReading} from './stocks-data'
import {type StocksScheme, stocksColors, stocksLayout} from './stocks-theme'

export type StocksChartProps = Pick<ChartSlotViewProps, 'rangeView' | 'tooltip'> & {
  height?: number
  /**
   * Whether one finger is reading. The trace takes the reading colour while it is.
   *
   * A flag and not the mark under the finger: the mark changes many times a scrub, and every change
   * to a prop here rebuilds the config the chart is handed. Nothing that moves with a finger belongs
   * in these props — the chart draws all of it from the touch itself.
   */
  isReading: boolean
  onInteraction?: ChartInteractionHandler
  range: StocksRange
  scheme: StocksScheme
}

/** Where the grid goes, in the chart's own coordinate space. */
export type StocksPlotGrid = {
  /** One per dated tick, then one closing the box at the last mark. */
  columns: readonly number[]
  /** One per price rule, then the floor. */
  rows: readonly number[]
}

/**
 * Where the plot's rules belong, read back off marks the chart measures and nobody draws. The
 * reported plot rect is not the same number on every renderer — the web bakes the axis padding
 * into it, the native ones keep it inside the frame — but an annotation lands where its data
 * lands, so a handful of them give the grid exactly, on all three.
 */
export const plotGrid = (geometry: ChartGeometry | null): StocksPlotGrid | null => {
  const at = (id: string) => geometry?.annotations.find(item => item.id === id)
  const columns = [0, 1, 2, 3].map(index => at(`col-${index}`)?.x)
  const rows = [0, 1, 2, 3].map(index => at(`row-${index}`)?.y)
  const corner = at('col-end')
  if (!corner || columns.some(value => value === undefined) || rows.some(value => value === undefined)) {
    return null
  }
  return {columns: [...(columns as number[]), corner.x], rows: [...(rows as number[]), corner.y]}
}

/** Whether a stretch of the period ended above where it started. */
export const rose = (values: readonly number[], from: number, to: number) =>
  (values[to] as number) >= (values[from] as number)

const PriceChart = ({
  height = stocksLayout.chartHeight,
  isReading,
  onInteraction,
  range,
  rangeView,
  scheme,
  tooltip,
}: StocksChartProps) => {
  const chart = useMemo(() => {
    const color = stocksColors[scheme]
    const reading = stocksReading(range)
    const domain = priceDomain(reading)
    const direction = reading.last >= range.open ? color.up : color.down

    return zyplot(z => ({
      /**
       * Nothing moves that the data did not. The sheet opens on a price that is already true, and
       * a tap on another range is a request to see that range — not to watch a month become a
       * year. Both would be the chart telling a story of its own.
       */
      animation: z.animation({enabled: false, initial: false, updates: false}),
      /**
       * The grid is the screen's to draw, behind the marks; these only say where. One at each dated
       * tick on the floor, one at each price rule on the leading edge, and one in the far corner
       * that closes the box.
       *
       * They are marks the chart measures and nobody draws, which is the only exact answer to where
       * the plot's sides are: a rule reports through the axis rather than through the marks, and the
       * two do not agree on the web.
       */
      annotations: [
        ...range.axisTicks.map((tick, index) =>
          z.annotation.measure({id: `col-${index}`, x: stocksCategories[tick.index] as string, y: domain.min})
        ),
        ...priceTicks(domain).map((value, index) =>
          z.annotation.measure({id: `row-${index}`, x: stocksCategories[0] as string, y: value})
        ),
        z.annotation.measure({
          id: 'col-end',
          x: stocksCategories[stocksCategories.length - 1] as string,
          y: domain.min,
        }),
      ],
      categories: stocksCategories,
      height,
      interaction: z.interaction.scrub({
        crosshairStyle: {color: color.scrub, width: 1},
        // There is only ever one trace, and it takes the reading colour whole while a finger is
        // down, so nothing steps back — a dimmed line under a crosshair reads as disabled.
        dimOpacity: 1,
        // The dot on the reading is the marker's, on all three: a dot fed back as an annotation is
        // one the chart cannot place until a scrub handler has been round, so it trails the finger.
        marker: z.marker.point({color: color.scrub, size: 15}),
        range: true,
        /**
         * Two fingers are a different reading: the stretch between them is painted in its own
         * direction and the rest of the period steps back behind it. The chart draws all of it from
         * the fingers, so the ends do not have to come back through a scrub handler to move.
         */
        rangeStyle: {color: color.up, dimOpacity: 0.32, dot: true, downColor: color.down},
      }),
      onInteraction,
      plot: fittedPlot,
      rangeView,
      // The split a two-finger span reads as is `interaction.rangeStyle`, drawn by the chart itself:
      // nothing about a held span reaches these props, so a span moving costs no chart at all.
      series: [
        z.series({
          color: isReading ? color.scrub : direction,
          id: 'price',
          label: range.label,
          /** Gathers under the trace and lets go of the floor, the way a quote chart's fill does. */
          style: {fill: z.fill({fadeTo: 0.06}), fillOpacity: 0.42, strokeWidth: 2},
          values: range.values,
        }),
      ],
      /** The scale's own rules, so the four across match the five down the plot draws itself. */
      theme: z.theme({colors: {axis: color.chartGrid, grid: color.chartGrid, label: color.textMuted}}),
      // The chart writes no words of its own for a reading: either the screen hands it one of its
      // own to mount, or the row above the plot says everything and this is nothing at all.
      tooltip: tooltip ?? false,
      xAxis: timeAxis,
      yAxis: priceAxis(domain),
    }))
  }, [height, isReading, onInteraction, range, rangeView, scheme, tooltip])

  return <Chart.Line {...chart} />
}

export const StocksChart = memo(PriceChart)
