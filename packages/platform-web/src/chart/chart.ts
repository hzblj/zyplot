import { AreaChart } from "./area";
import { BarChart } from "./bar";
import { BoxplotChart } from "./boxplot";
import { DivergingBarChart } from "./diverging-bar";
import { DumbbellChart } from "./dumbbell";
import { FunnelChart } from "./funnel";
import { GaugeChart } from "./gauge";
import { HeatmapChart } from "./heatmap";
import { HistogramChart } from "./histogram";
import { LineChart } from "./line";
import { MeterBar } from "./meter";
import { PieChart } from "./pie";
import { RadarChart } from "./radar";
import { SankeyChart } from "./sankey";
import { ScatterChart } from "./scatter";
import { ChartFrame, ChartLegend } from "./shared/frame";
import { withCustomSkeleton } from "./shared/skeleton";
import { ChartProvider } from "./shared/theme";
import { Sparkline } from "./sparkline";
import { StackedBarChart } from "./stacked-bar";
import { StatTile } from "./stat";
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
	Area: withCustomSkeleton(AreaChart),
	Bar: withCustomSkeleton(BarChart),
	Boxplot: withCustomSkeleton(BoxplotChart),
	DivergingBar: withCustomSkeleton(DivergingBarChart),
	Dumbbell: withCustomSkeleton(DumbbellChart),
	Frame: ChartFrame,
	Funnel: withCustomSkeleton(FunnelChart),
	Gauge: withCustomSkeleton(GaugeChart),
	Heatmap: withCustomSkeleton(HeatmapChart),
	Histogram: withCustomSkeleton(HistogramChart),
	Legend: ChartLegend,
	Line: withCustomSkeleton(LineChart),
	Meter: MeterBar,
	Pie: withCustomSkeleton(PieChart),
	Provider: ChartProvider,
	Radar: withCustomSkeleton(RadarChart),
	Sankey: withCustomSkeleton(SankeyChart),
	Scatter: withCustomSkeleton(ScatterChart),
	Sparkline,
	StackedBar: withCustomSkeleton(StackedBarChart),
	Stat: StatTile,
	Sunburst: withCustomSkeleton(SunburstChart),
	TimeSeries: withCustomSkeleton(TimeSeriesChart),
	Treemap: withCustomSkeleton(TreemapChart),
};
