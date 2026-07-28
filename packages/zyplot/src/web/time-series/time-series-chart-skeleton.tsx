import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonLine } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The TimeSeriesChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type TimeSeriesChartSkeletonProps = ChartSkeletonProps;

export const TimeSeriesChartSkeleton: FC<TimeSeriesChartSkeletonProps> = ({
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
		<SkeletonLine count={2} />
	</ChartSkeletonFrame>
);
