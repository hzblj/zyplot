import type {
	AreaChartProps,
	BarChartProps,
	BoxplotChartProps,
	CandlestickChartProps,
	DivergingBarChartProps,
	DumbbellChartProps,
	FunnelChartProps,
	GaugeChartProps,
	HeatmapChartProps,
	HierarchyChartProps,
	HistogramChartProps,
	LineChartProps,
	MeterChartProps,
	PieChartProps,
	RadarChartProps,
	SankeyChartProps,
	ScatterChartProps,
	SparklineChartProps,
	StackedBarChartProps,
	TimeSeriesChartProps,
} from "@hzblj/zyplot-core";
import { createChart } from "./create-chart";

/**
 * The forms Swift Charts and Jetpack Compose both implement.
 *
 * This is what `@hzblj/zyplot` hands a caller who has not committed to a
 * platform: every entry renders on iOS and Android alike, so a component built
 * on it needs no `.ios.tsx` / `.android.tsx` split. The platform entry points
 * layer their own forms on top — `Chart.Range` and `Chart.Rule` on iOS,
 * `Chart.Lollipop` and `Chart.Waterfall` on Android.
 *
 * `PlatformProps` is how those entry points widen the shared forms with the
 * axis options only their renderer understands, without restating all
 * twenty-one components.
 */
export const createSharedCharts = <PlatformProps = unknown>() => ({
	Area: createChart<AreaChartProps & PlatformProps>("area"),
	Bar: createChart<BarChartProps & PlatformProps>("bar"),
	Boxplot: createChart<BoxplotChartProps & PlatformProps>("boxplot"),
	Candlestick: createChart<CandlestickChartProps & PlatformProps>(
		"candlestick",
	),
	DivergingBar: createChart<DivergingBarChartProps & PlatformProps>(
		"diverging-bar",
	),
	Dumbbell: createChart<DumbbellChartProps & PlatformProps>("dumbbell"),
	Funnel: createChart<FunnelChartProps & PlatformProps>("funnel"),
	Gauge: createChart<GaugeChartProps & PlatformProps>("gauge"),
	Heatmap: createChart<HeatmapChartProps & PlatformProps>("heatmap"),
	Histogram: createChart<HistogramChartProps & PlatformProps>("histogram"),
	Line: createChart<LineChartProps & PlatformProps>("line"),
	Meter: createChart<MeterChartProps & PlatformProps>("meter"),
	Pie: createChart<PieChartProps & PlatformProps>("pie"),
	Radar: createChart<RadarChartProps & PlatformProps>("radar"),
	Sankey: createChart<SankeyChartProps & PlatformProps>("sankey"),
	Scatter: createChart<ScatterChartProps & PlatformProps>("scatter"),
	Sparkline: createChart<SparklineChartProps & PlatformProps>("sparkline"),
	StackedBar: createChart<StackedBarChartProps & PlatformProps>("stacked-bar"),
	Sunburst: createChart<HierarchyChartProps & PlatformProps>("sunburst"),
	TimeSeries: createChart<TimeSeriesChartProps & PlatformProps>("time-series"),
	Treemap: createChart<HierarchyChartProps & PlatformProps>("treemap"),
});
