import type {NativeChartAxisOptions, NativeChartBaseProps} from '@hzblj/zyplot-core'

/** The x axis, plus the scrolling window Swift Charts can show. */
export type ChartAxisXIos = NativeChartAxisOptions & {
  /** Which value the visible window starts at. */
  scrollPosition?: number | string
  /** How much of the domain fits on screen at once. */
  visibleDomain?: number
}

/** The y axis. `plotDimension*Padding` comes from `NativeChartAxisOptions`. */
export type ChartAxisYIos = NativeChartAxisOptions

/** The axis options every iOS chart accepts on top of the shared ones. */
export type ChartPlatformPropsIos = {
  xAxis?: ChartAxisXIos
  yAxis?: ChartAxisYIos
}

/** One rule: a line at `value`, optionally clipped to a `start`–`end` span. */
export type ChartRuleDatumIos = {
  end?: number
  id: string
  label: string
  start?: number
  value: number
}

/** Props for `Chart.Rule`, drawn by Swift Charts' `RuleMark`. iOS only. */
export type ChartRulePropsIos = NativeChartBaseProps &
  ChartPlatformPropsIos & {
    data: readonly ChartRuleDatumIos[]
    orientation?: 'horizontal' | 'vertical'
  }

/** One band: a low-to-high span sitting on a category. */
export type ChartRangeDatumIos = {
  category: string
  color?: string
  high: number
  id: string
  low: number
}

/** Props for `Chart.Range`, drawn by Swift Charts' `RectangleMark`. iOS only. */
export type ChartRangePropsIos = NativeChartBaseProps &
  ChartPlatformPropsIos & {
    data: readonly ChartRangeDatumIos[]
  }

/** The forms only the iOS renderer provides. */
export type ChartExtensionKindIos = 'range' | 'rule'
