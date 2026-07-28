import { DumbbellChart as DumbbellChartRoot } from "./dumbbell-chart";
import { DumbbellChartSkeleton } from "./dumbbell-chart-skeleton";

export type { DumbbellChartProps } from "./dumbbell-chart";
export type { DumbbellChartSkeletonProps } from "./dumbbell-chart-skeleton";

/** `Chart.Dumbbell` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const DumbbellChart = Object.assign(DumbbellChartRoot, {
	Skeleton: DumbbellChartSkeleton,
});
