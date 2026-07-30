import {ChartProvider} from '../native/chart-provider'
import {createChart} from '../native/create-chart'
import {createSharedCharts} from '../native/shared-charts'
import type {ChartLollipopPropsAndroid, ChartPlatformPropsAndroid, ChartWaterfallPropsAndroid} from './contracts'

export type * from '@hzblj/zyplot-core'
export {
  animation,
  annotation,
  axis,
  format,
  glow,
  halo,
  interaction,
  marker,
  plot,
  reveal,
  series,
  seriesProps,
  seriesStyle,
  surface,
  theme,
} from '@hzblj/zyplot-core'
export type {ChartAnnotationViews} from '../shared/annotation-views'
export type {ChartScrub, ChartScrubSelection} from '../shared/use-chart-scrub'
export {useChartScrub} from '../shared/use-chart-scrub'
export type {ChartReading} from '../shared/use-last-reading'
export {useLastReading} from '../shared/use-last-reading'
export type * from './contracts'

/**
 * Every chart, with the Compose renderer's axis options added, plus
 * `Chart.Lollipop` and `Chart.Waterfall` which only Android has.
 *
 * Importing this commits the file to Android, so name it `*.android.tsx` and let
 * Metro pick it. `@hzblj/zyplot/ios` is the other half.
 */
export const Chart = {
  ...createSharedCharts<ChartPlatformPropsAndroid>(),
  Lollipop: createChart<ChartLollipopPropsAndroid>('lollipop'),
  Provider: ChartProvider,
  Waterfall: createChart<ChartWaterfallPropsAndroid>('waterfall'),
}
