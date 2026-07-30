export type * from '@hzblj/zyplot-core'
export {
  animation,
  annotation,
  axis,
  fill,
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

import {ChartProvider} from './native/chart-provider'
import {createSharedCharts} from './native/shared-charts'

export type {ChartProviderProps} from './native/chart-provider'
export type {ChartAnnotationViews} from './shared/annotation-views'
export type {ChartScrub, ChartScrubSelection} from './shared/use-chart-scrub'
export {useChartScrub} from './shared/use-chart-scrub'
export type {ChartReading} from './shared/use-last-reading'
export {useLastReading} from './shared/use-last-reading'

/**
 * Every chart, as `Chart.Line`, `Chart.Bar` and so on. Everything here renders
 * on both iOS and Android.
 *
 * For a form only one platform has, or for that platform's axis options, import
 * `@hzblj/zyplot/ios` or `@hzblj/zyplot/android` from a `.ios.tsx`/`.android.tsx` file.
 */
export const Chart = {
  ...createSharedCharts(),
  Provider: ChartProvider,
}
