import 'uplot/dist/uPlot.min.css'
import '../charts.css'
import {AreaChart} from './area'
import {BarChart} from './bar'
import {BoxplotChart} from './boxplot'
import {CandlestickChart} from './candlestick'
import {DivergingBarChart} from './diverging-bar'
import {DumbbellChart} from './dumbbell'
import {FunnelChart} from './funnel'
import {GaugeChart} from './gauge'
import {HeatmapChart} from './heatmap'
import {HistogramChart} from './histogram'
import {LineChart} from './line'
import {MeterBar, type MeterBarProps} from './meter'
import {PieChart} from './pie'
import {RadarChart} from './radar'
import {SankeyChart} from './sankey'
import {ScatterChart} from './scatter'
import {ChartFrame, ChartLegend, withAnnotationViews, withSurface} from './shared/frame'
import {withCustomSkeleton} from './shared/skeleton'
import {ChartProvider} from './shared/theme'
import {Sparkline, type SparklineProps} from './sparkline'
import {StackedBarChart} from './stacked-bar'
import {SunburstChart} from './sunburst'
import {TimeSeriesChart} from './time-series'
import {TreemapChart} from './treemap'

/**
 * Every chart form, reached as `<Chart.Bar />` or `<Chart.Sankey />`. Each one
 * carries its own loading placeholder at `<Chart.Bar.Skeleton />`.
 *
 * `Chart.Provider` sets shared defaults, `Chart.Frame` is the optional card
 * around a chart, and `Chart.Legend` lets you place the legend yourself.
 */
export const Chart = {
  Area: withSurface(withCustomSkeleton(withAnnotationViews(AreaChart))),
  Bar: withSurface(withCustomSkeleton(withAnnotationViews(BarChart))),
  Boxplot: withSurface(withCustomSkeleton(BoxplotChart)),
  Candlestick: withSurface(withCustomSkeleton(withAnnotationViews(CandlestickChart))),
  DivergingBar: withSurface(withCustomSkeleton(DivergingBarChart)),
  Dumbbell: withSurface(withCustomSkeleton(DumbbellChart)),
  Frame: ChartFrame,
  Funnel: withSurface(withCustomSkeleton(FunnelChart)),
  Gauge: withSurface(withCustomSkeleton(GaugeChart)),
  Heatmap: withSurface(withCustomSkeleton(HeatmapChart)),
  Histogram: withSurface(withCustomSkeleton(HistogramChart)),
  Legend: ChartLegend,
  Line: withSurface(withCustomSkeleton(withAnnotationViews(LineChart))),
  Meter: withSurface<MeterBarProps>(MeterBar),
  Pie: withSurface(withCustomSkeleton(PieChart)),
  Provider: ChartProvider,
  Radar: withSurface(withCustomSkeleton(RadarChart)),
  Sankey: withSurface(withCustomSkeleton(SankeyChart)),
  Scatter: withSurface(withCustomSkeleton(ScatterChart)),
  Sparkline: withSurface<SparklineProps>(Sparkline),
  StackedBar: withSurface(withCustomSkeleton(withAnnotationViews(StackedBarChart))),
  Sunburst: withSurface(withCustomSkeleton(SunburstChart)),
  TimeSeries: withSurface(withCustomSkeleton(TimeSeriesChart)),
  Treemap: withSurface(withCustomSkeleton(TreemapChart)),
}
