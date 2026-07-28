import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonBoxplot } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The BoxplotChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type BoxplotChartSkeletonProps = ChartSkeletonProps;

export const BoxplotChartSkeleton: FC<BoxplotChartSkeletonProps> = ({
	className,
	height,
	legendCount = 0,
	xAxis = true,
	yAxis = true,
}) => (
	<ChartSkeletonFrame
		className={className}
		height={height}
		legendCount={legendCount}
		xAxis={xAxis}
		yAxis={yAxis}
	>
		<SkeletonBoxplot />
	</ChartSkeletonFrame>
);
