import { ScatterChart as ScatterChartRoot } from "./scatter-chart";
import { ScatterChartSkeleton } from "./scatter-chart-skeleton";

export type { ScatterChartProps } from "./scatter-chart";
export type { ScatterChartSkeletonProps } from "./scatter-chart-skeleton";

/** `Chart.Scatter` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const ScatterChart = Object.assign(ScatterChartRoot, {
	Skeleton: ScatterChartSkeleton,
});
