/**
 * The web chart namespace: every form, rendered by ECharts and uPlot in the DOM.
 *
 * The individual components are deliberately **not** re-exported. `Chart.Bar` is
 * the only way to reach a bar chart, which keeps the twenty-odd forms from
 * flooding the barrel and makes the family obvious at the call site. Everything
 * under `shared/` is internal — a feature reaching for `ChartShell` or
 * `useChartTokens` is building a chart that should live here instead.
 *
 * This is also what a plain `@hzblj/zyplot` import resolves to outside React
 * Native, so importing the subpath only matters when a file must be web even in
 * a project that has both.
 */

import "../../style.css";

export type { AreaChartProps, AreaChartSkeletonProps } from "./area";
export type { BarChartProps, BarChartSkeletonProps } from "./bar";
export type { BoxplotChartProps, BoxplotChartSkeletonProps } from "./boxplot";
export type {
	CandlestickChartProps,
	CandlestickChartSkeletonProps,
} from "./candlestick";
export { Chart } from "./chart";
export type {
	DivergingBarChartProps,
	DivergingBarChartSkeletonProps,
} from "./diverging-bar";
export type {
	DumbbellChartProps,
	DumbbellChartSkeletonProps,
} from "./dumbbell";
export type { FunnelChartProps, FunnelChartSkeletonProps } from "./funnel";
export type { GaugeChartProps, GaugeChartSkeletonProps } from "./gauge";
export type { HeatmapChartProps, HeatmapChartSkeletonProps } from "./heatmap";
export type {
	HistogramChartProps,
	HistogramChartSkeletonProps,
} from "./histogram";
export type { LineChartProps, LineChartSkeletonProps } from "./line";
export type { MeterBarProps, MeterBarSkeletonProps } from "./meter";
export type { PieChartProps, PieChartSkeletonProps } from "./pie";
export type { RadarChartProps, RadarChartSkeletonProps } from "./radar";
export type { SankeyChartProps, SankeyChartSkeletonProps } from "./sankey";
export type { ScatterChartProps, ScatterChartSkeletonProps } from "./scatter";
export type {
	ChartColorMode,
	ChartProviderProps,
	ChartTheme,
} from "./shared/theme";
export type * from "./shared/types";
export type { SparklineProps, SparklineSkeletonProps } from "./sparkline";
export type {
	StackedBarChartProps,
	StackedBarChartSkeletonProps,
} from "./stacked-bar";
export type {
	SunburstChartProps,
	SunburstChartSkeletonProps,
} from "./sunburst";
export type {
	TimeSeriesChartProps,
	TimeSeriesChartSkeletonProps,
} from "./time-series";
export type { TreemapChartProps, TreemapChartSkeletonProps } from "./treemap";
