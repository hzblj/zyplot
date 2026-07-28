import { AreaChart } from "./area";
import { BarChart } from "./bar";
import { BoxplotChart } from "./boxplot";
import { CandlestickChart } from "./candlestick";
import { DivergingBarChart } from "./diverging-bar";
import { DumbbellChart } from "./dumbbell";
import { FunnelChart } from "./funnel";
import { GaugeChart } from "./gauge";
import { HeatmapChart } from "./heatmap";
import { HistogramChart } from "./histogram";
import { LineChart } from "./line";
import { MeterBar, type MeterBarProps } from "./meter";
import { PieChart } from "./pie";
import { RadarChart } from "./radar";
import { SankeyChart } from "./sankey";
import { ScatterChart } from "./scatter";
import { ChartFrame, ChartLegend, withSurface } from "./shared/frame";
import { withCustomSkeleton } from "./shared/skeleton";
import { ChartProvider } from "./shared/theme";
import { Sparkline, type SparklineProps } from "./sparkline";
import { StackedBarChart } from "./stacked-bar";
import { SunburstChart } from "./sunburst";
import { TimeSeriesChart } from "./time-series";
import { TreemapChart } from "./treemap";

/**
 * The one export this organism has.
 *
 * Every form is reached through it — `<Chart.Bar …>`, `<Chart.Sankey …>` — and
 * every one carries its own placeholder at `<Chart.Bar.Skeleton />`. Keeping the
 * surface to a single name is what makes the set legible: a reader who has seen
 * `Chart.Line` can guess `Chart.Boxplot` without opening the barrel, and a chart
 * can never be imported without its skeleton being one dot away.
 *
 * Names are the **form**, not the implementation. `Chart.TimeSeries` says what it
 * is for; that it runs on uPlot while `Chart.Line` runs on ECharts is an internal
 * detail, and callers pick between them on data density, not on engine.
 *
 * `Chart.Frame` is the optional card (title, description, actions, caption);
 * `Chart.Legend` is exposed for the rare surface that positions identity itself.
 */
export const Chart = {
	Area: withSurface(withCustomSkeleton(AreaChart)),
	Bar: withSurface(withCustomSkeleton(BarChart)),
	Boxplot: withSurface(withCustomSkeleton(BoxplotChart)),
	Candlestick: withSurface(withCustomSkeleton(CandlestickChart)),
	DivergingBar: withSurface(withCustomSkeleton(DivergingBarChart)),
	Dumbbell: withSurface(withCustomSkeleton(DumbbellChart)),
	Frame: ChartFrame,
	Funnel: withSurface(withCustomSkeleton(FunnelChart)),
	Gauge: withSurface(withCustomSkeleton(GaugeChart)),
	Heatmap: withSurface(withCustomSkeleton(HeatmapChart)),
	Histogram: withSurface(withCustomSkeleton(HistogramChart)),
	Legend: ChartLegend,
	Line: withSurface(withCustomSkeleton(LineChart)),
	Meter: withSurface<MeterBarProps>(MeterBar),
	Pie: withSurface(withCustomSkeleton(PieChart)),
	Provider: ChartProvider,
	Radar: withSurface(withCustomSkeleton(RadarChart)),
	Sankey: withSurface(withCustomSkeleton(SankeyChart)),
	Scatter: withSurface(withCustomSkeleton(ScatterChart)),
	Sparkline: withSurface<SparklineProps>(Sparkline),
	StackedBar: withSurface(withCustomSkeleton(StackedBarChart)),
	Sunburst: withSurface(withCustomSkeleton(SunburstChart)),
	TimeSeries: withSurface(withCustomSkeleton(TimeSeriesChart)),
	Treemap: withSurface(withCustomSkeleton(TreemapChart)),
};
