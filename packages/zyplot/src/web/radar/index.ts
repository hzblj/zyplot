import { RadarChart as RadarChartRoot } from "./radar-chart";
import { RadarChartSkeleton } from "./radar-chart-skeleton";

export type { RadarChartProps } from "./radar-chart";
export type { RadarChartSkeletonProps } from "./radar-chart-skeleton";

/** `Chart.Radar` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const RadarChart = Object.assign(RadarChartRoot, {
	Skeleton: RadarChartSkeleton,
});
