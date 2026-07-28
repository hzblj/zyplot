import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonLine } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The LineChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type LineChartSkeletonProps = ChartSkeletonProps;

export const LineChartSkeleton: FC<LineChartSkeletonProps> = ({
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
		<SkeletonLine />
	</ChartSkeletonFrame>
);
