import { BoxplotChart as BoxplotChartRoot } from "./boxplot-chart";
import { BoxplotChartSkeleton } from "./boxplot-chart-skeleton";

export type { BoxplotChartProps } from "./boxplot-chart";
export type { BoxplotChartSkeletonProps } from "./boxplot-chart-skeleton";

/** `Chart.Boxplot` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const BoxplotChart = Object.assign(BoxplotChartRoot, {
	Skeleton: BoxplotChartSkeleton,
});
