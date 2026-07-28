import { FunnelChart as FunnelChartRoot } from "./funnel-chart";
import { FunnelChartSkeleton } from "./funnel-chart-skeleton";

export type { FunnelChartProps } from "./funnel-chart";
export type { FunnelChartSkeletonProps } from "./funnel-chart-skeleton";

/** `Chart.Funnel` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const FunnelChart = Object.assign(FunnelChartRoot, {
	Skeleton: FunnelChartSkeleton,
});
