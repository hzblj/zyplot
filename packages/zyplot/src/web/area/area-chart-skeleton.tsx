import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonArea } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The AreaChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type AreaChartSkeletonProps = ChartSkeletonProps;

export const AreaChartSkeleton: FC<AreaChartSkeletonProps> = ({
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
		<SkeletonArea />
	</ChartSkeletonFrame>
);
