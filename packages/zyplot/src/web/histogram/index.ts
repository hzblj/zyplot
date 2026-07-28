import { HistogramChart as HistogramChartRoot } from "./histogram-chart";
import { HistogramChartSkeleton } from "./histogram-chart-skeleton";

export type { HistogramChartProps } from "./histogram-chart";
export type { HistogramChartSkeletonProps } from "./histogram-chart-skeleton";

/** `Chart.Histogram` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const HistogramChart = Object.assign(HistogramChartRoot, {
	Skeleton: HistogramChartSkeleton,
});
