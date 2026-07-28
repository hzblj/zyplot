import { HeatmapChart as HeatmapChartRoot } from "./heatmap-chart";
import { HeatmapChartSkeleton } from "./heatmap-chart-skeleton";

export type { HeatmapChartProps } from "./heatmap-chart";
export type { HeatmapChartSkeletonProps } from "./heatmap-chart-skeleton";

/** `Chart.Heatmap` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const HeatmapChart = Object.assign(HeatmapChartRoot, {
	Skeleton: HeatmapChartSkeleton,
});
