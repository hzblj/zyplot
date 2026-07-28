import { MeterBar as MeterBarRoot } from "./meter-bar";
import { MeterBarSkeleton } from "./meter-bar-skeleton";

export type { MeterBarProps } from "./meter-bar";
export type { MeterBarSkeletonProps } from "./meter-bar-skeleton";

/** `Chart.Meter` — the ratio bar, with its placeholder as `.Skeleton`. */
export const MeterBar = Object.assign(MeterBarRoot, {
	Skeleton: MeterBarSkeleton,
});
