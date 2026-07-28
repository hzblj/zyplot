import { DivergingBarChart as DivergingBarChartRoot } from "./diverging-bar-chart";
import { DivergingBarChartSkeleton } from "./diverging-bar-chart-skeleton";

export type { DivergingBarChartProps } from "./diverging-bar-chart";
export type { DivergingBarChartSkeletonProps } from "./diverging-bar-chart-skeleton";

/** `Chart.DivergingBar` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const DivergingBarChart = Object.assign(DivergingBarChartRoot, {
	Skeleton: DivergingBarChartSkeleton,
});
