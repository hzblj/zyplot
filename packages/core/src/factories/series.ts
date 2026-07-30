import type {ChartSeries} from '../contracts/chart-data'
import type {NativeChartSeriesStyle} from '../contracts/chart-native'

/** A series with the styling that belongs to it. */
export type StyledChartSeries = ChartSeries & {style?: NativeChartSeriesStyle}

/**
 * One series, styling included.
 *
 * `seriesStyles` is a record keyed by `id`, so styling a series normally means
 * writing its id twice — once on the series, once as the key — with nothing checking
 * the two agree. A typo does not fail, it silently drops the styling. Declaring both
 * in one place removes the second spelling.
 */
export const series = (options: StyledChartSeries): StyledChartSeries => options

/**
 * Splits styled series into the two props a chart takes.
 *
 * @example
 * const lines = useMemo(
 *   () => seriesProps([
 *     series({color: '#f43', id: 'price', label: 'Price', style: {strokeWidth: 2.3}, values}),
 *   ]),
 *   [values]
 * )
 *
 * <Chart.Line {...lines} categories={categories} />
 *
 * Both props are rebuilt on every call, so hold the result across renders — a chart
 * whose props change identity re-serialises its whole dataset.
 */
export const seriesProps = (list: readonly StyledChartSeries[]) => ({
  series: list.map(({style: _style, ...rest}) => rest),
  seriesStyles: Object.fromEntries(list.flatMap(({id, style}) => (style ? [[id, style] as const] : []))),
})
