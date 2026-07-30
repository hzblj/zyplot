import {ChartProvider} from '../native/chart-provider'
import {createChart} from '../native/create-chart'
import {createSharedCharts} from '../native/shared-charts'
import type {ChartPlatformPropsIos, ChartRangePropsIos, ChartRulePropsIos} from './contracts'

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
export type {ChartAnnotationViews} from '../shared/annotation-views'
export type {ChartScrub, ChartScrubSelection} from '../shared/use-chart-scrub'
export {useChartScrub} from '../shared/use-chart-scrub'
export type {ChartReading} from '../shared/use-last-reading'
export {useLastReading} from '../shared/use-last-reading'
export type * from './contracts'

/**
 * Every chart, with Swift Charts' axis options added, plus `Chart.Range` and
 * `Chart.Rule` which only iOS has.
 *
 * Importing this commits the file to iOS, so name it `*.ios.tsx` and let Metro
 * pick it. `@hzblj/zyplot/android` is the other half.
 */
export const Chart = {
  ...createSharedCharts<ChartPlatformPropsIos>(),
  Provider: ChartProvider,
  Range: createChart<ChartRangePropsIos>('range'),
  Rule: createChart<ChartRulePropsIos>('rule'),
}
