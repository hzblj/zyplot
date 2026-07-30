import type {ChartDatum, NativeChartAxisOptions, NativeChartBaseProps} from '@hzblj/zyplot-core'

/** The x axis, plus what Compose does with a label too long for its slot. */
export type ChartAxisXAndroid = NativeChartAxisOptions & {
  labelOverflow?: 'clip' | 'ellipsis' | 'visible'
}

/** The y axis, plus what Compose does with a label too long for its slot. */
export type ChartAxisYAndroid = NativeChartAxisOptions & {
  labelOverflow?: 'clip' | 'ellipsis' | 'visible'
}

/** The axis options every Android chart accepts on top of the shared ones. */
export type ChartPlatformPropsAndroid = {
  xAxis?: ChartAxisXAndroid
  yAxis?: ChartAxisYAndroid
}

/** One step of a waterfall. Positive values add, negative ones subtract. */
export type ChartWaterfallDatumAndroid = {
  id: string
  label: string
  value: number
}

/** Props for `Chart.Waterfall`, drawn by the Compose canvas. Android only. */
export type ChartWaterfallPropsAndroid = NativeChartBaseProps &
  ChartPlatformPropsAndroid & {
    data: readonly ChartWaterfallDatumAndroid[]
  }

/** Props for `Chart.Lollipop`: a thin stem with a dot instead of a bar. Android only. */
export type ChartLollipopPropsAndroid = NativeChartBaseProps &
  ChartPlatformPropsAndroid & {
    data: readonly ChartDatum[]
    orientation?: 'horizontal' | 'vertical'
  }

/** The forms only the Android renderer provides. */
export type ChartExtensionKindAndroid = 'lollipop' | 'waterfall'
