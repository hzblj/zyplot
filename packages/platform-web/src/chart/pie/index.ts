import { PieChart as PieChartRoot } from "./pie-chart";
import { PieChartSkeleton } from "./pie-chart-skeleton";

export type { PieChartProps } from "./pie-chart";
export type { PieChartSkeletonProps } from "./pie-chart-skeleton";

/** `Chart.Pie` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const PieChart = Object.assign(PieChartRoot, {
	Skeleton: PieChartSkeleton,
});
