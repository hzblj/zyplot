import { BarChart as BarChartRoot } from "./bar-chart";
import { BarChartSkeleton } from "./bar-chart-skeleton";

export type { BarChartProps } from "./bar-chart";
export type { BarChartSkeletonProps } from "./bar-chart-skeleton";

/** `Chart.Bar` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const BarChart = Object.assign(BarChartRoot, {
	Skeleton: BarChartSkeleton,
});
