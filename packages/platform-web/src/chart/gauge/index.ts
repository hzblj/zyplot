import { GaugeChart as GaugeChartRoot } from "./gauge-chart";
import { GaugeChartSkeleton } from "./gauge-chart-skeleton";

export type { GaugeChartProps } from "./gauge-chart";
export type { GaugeChartSkeletonProps } from "./gauge-chart-skeleton";

/** `Chart.Gauge` — the chart, with its placeholder hanging off it as `.Skeleton`. */
export const GaugeChart = Object.assign(GaugeChartRoot, {
	Skeleton: GaugeChartSkeleton,
});
