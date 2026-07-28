import type { FC } from "react";
import { Skeleton } from "../shared/primitives";
import type { ChartSkeletonProps } from "../shared/types";
import { cn } from "../shared/utils";

/**
 * The tile's placeholder reproduces its three rows — label, figure, delta — at
 * the real type sizes. A KPI row is the first thing on a dashboard, so it is
 * also the thing whose reflow shoves everything else down the page.
 */
export type StatTileSkeletonProps = ChartSkeletonProps & {
	/** Reserves the sparkline row. Match it to whether the real tile passes `trend`. */
	hasTrend?: boolean;
};

export const StatTileSkeleton: FC<StatTileSkeletonProps> = ({
	className,
	hasTrend = false,
}) => (
	<div
		aria-hidden
		className={cn(
			"flex flex-col gap-2 rounded-xl border-[0.5px] border-border-tertiary bg-surface-secondary p-4 shadow-card-default",
			className,
		)}
	>
		<Skeleton className="h-3.5 w-24" />
		<Skeleton className="h-7 w-32" />
		<Skeleton className="h-3.5 w-20" />
		{hasTrend && <Skeleton className="mt-1 h-8 w-full" />}
	</div>
);
