import type { FC } from "react";
import { Skeleton } from "../shared/primitives";
import type { ChartSkeletonProps } from "../shared/types";
import { cn } from "../shared/utils";

const DEFAULT_HEIGHT = 32;

/**
 * A sparkline's placeholder is a hairline, not a block. Reserving the full band
 * would make the stat tile above it jump by 20px when the trend arrives.
 */
export type SparklineSkeletonProps = ChartSkeletonProps;

export const SparklineSkeleton: FC<SparklineSkeletonProps> = ({
	className,
	height = DEFAULT_HEIGHT,
}) => (
	<div
		aria-hidden
		className={cn("flex w-full items-center", className)}
		style={{ height }}
	>
		<Skeleton className="h-0.5 w-full rounded-full" />
	</div>
);
