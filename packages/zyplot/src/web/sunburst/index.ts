import { SunburstChart as SunburstChartRoot } from "./sunburst-chart";
import { SunburstChartSkeleton } from "./sunburst-chart-skeleton";

export type { SunburstChartProps } from "./sunburst-chart";
export type { SunburstChartSkeletonProps } from "./sunburst-chart-skeleton";

/** `Chart.Sunburst` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const SunburstChart = Object.assign(SunburstChartRoot, {
	Skeleton: SunburstChartSkeleton,
});
