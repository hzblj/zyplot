import { SankeyChart as SankeyChartRoot } from "./sankey-chart";
import { SankeyChartSkeleton } from "./sankey-chart-skeleton";

export type { SankeyChartProps } from "./sankey-chart";
export type { SankeyChartSkeletonProps } from "./sankey-chart-skeleton";

/** `Chart.Sankey` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const SankeyChart = Object.assign(SankeyChartRoot, {
	Skeleton: SankeyChartSkeleton,
});
