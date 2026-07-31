import {Chart, type ChartGeometry, series, seriesProps} from '@hzblj/zyplot'
import {memo, useMemo} from 'react'
import {isWeb} from '../platform'
import {fittedPlot, priceAxis, priceDomain, priceTicks, stocksChartStyle, timeAxis} from './stocks-chart-style'
import {type StocksRange, stocksCategories, stocksReading} from './stocks-data'
import {type StocksScheme, stocksColors, stocksLayout} from './stocks-theme'

export type StocksChartProps = {
  height?: number
  onInteraction?: Parameters<typeof Chart.Line>[0]['onInteraction']
  range: StocksRange
  scheme: StocksScheme
  /** The mark one finger is on, or `null`. The trace takes the reading colour while it is set. */
  scrubIndex: number | null
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
  onInteraction,
  range,
  scheme,
  scrubIndex,
}: StocksChartProps) => {
  const color = stocksColors[scheme]
  const style = stocksChartStyle(scheme)
  const reading = useMemo(() => stocksReading(range), [range])
  const domain = useMemo(() => priceDomain(reading), [reading])

  const direction = reading.last >= range.open ? color.up : color.down
  const base = scrubIndex === null ? direction : color.scrub

  // The split a two-finger span reads as is `interaction.rangeStyle`, drawn by the chart itself:
  // nothing about a held span reaches these props, so a span moving costs no chart at all.
  const lines = useMemo(
    () =>
      seriesProps([
        series({color: base, id: 'price', label: range.label, style: style.traceStyle, values: range.values}),
      ]),
    [base, range, style]
  )

  const annotations = useMemo(
    () => [
      // The grid is the screen's to draw, behind the marks; these only say where. One at each
      // dated tick on the floor, one at each price rule on the leading edge, and one in the far
      // corner that closes the box.
      ...range.axisTicks.map((tick, index) =>
        style.edge(`col-${index}`, stocksCategories[tick.index] as string, domain.min)
      ),
      ...priceTicks(domain).map((value, index) => style.edge(`row-${index}`, stocksCategories[0] as string, value)),
      style.edge('col-end', stocksCategories[stocksCategories.length - 1] as string, domain.min),
      ...(isWeb && scrubIndex !== null
        ? [style.scrubPoint(stocksCategories[scrubIndex] as string, range.values[scrubIndex] as number)]
        : []),
    ],
    [domain, range, scrubIndex, style]
  )

  return (
    <Chart.Line
      {...lines}
      animation={style.arrival}
      annotations={annotations}
      categories={stocksCategories}
      height={height}
      interaction={style.scrubbing}
      onInteraction={onInteraction}
      plot={fittedPlot}
      theme={style.grid}
      xAxis={timeAxis}
      yAxis={priceAxis(domain)}
    />
  )
}

export const StocksChart = memo(PriceChart)
