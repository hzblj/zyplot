import { StackedBarChart as StackedBarChartRoot } from "./stacked-bar-chart";
import { StackedBarChartSkeleton } from "./stacked-bar-chart-skeleton";

export type { StackedBarChartProps } from "./stacked-bar-chart";
export type { StackedBarChartSkeletonProps } from "./stacked-bar-chart-skeleton";

/** `Chart.StackedBar` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const StackedBarChart = Object.assign(StackedBarChartRoot, {
	Skeleton: StackedBarChartSkeleton,
});
