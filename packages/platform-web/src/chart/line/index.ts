import { LineChart as LineChartRoot } from "./line-chart";
import { LineChartSkeleton } from "./line-chart-skeleton";

export type { LineChartProps } from "./line-chart";
export type { LineChartSkeletonProps } from "./line-chart-skeleton";

/** `Chart.Line` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const LineChart = Object.assign(LineChartRoot, {
	Skeleton: LineChartSkeleton,
});
