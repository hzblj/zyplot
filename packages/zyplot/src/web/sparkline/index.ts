import { Sparkline as SparklineRoot } from "./sparkline";
import { SparklineSkeleton } from "./sparkline-skeleton";

export type { SparklineProps } from "./sparkline";
export type { SparklineSkeletonProps } from "./sparkline-skeleton";

/** `Chart.Sparkline` — the trend glyph, with its placeholder as `.Skeleton`. */
export const Sparkline = Object.assign(SparklineRoot, {
	Skeleton: SparklineSkeleton,
});
