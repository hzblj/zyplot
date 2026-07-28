import { TreemapChart as TreemapChartRoot } from "./treemap-chart";
import { TreemapChartSkeleton } from "./treemap-chart-skeleton";

export type { TreemapChartProps } from "./treemap-chart";
export type { TreemapChartSkeletonProps } from "./treemap-chart-skeleton";

/** `Chart.Treemap` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const TreemapChart = Object.assign(TreemapChartRoot, {
	Skeleton: TreemapChartSkeleton,
});
