import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonBars } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The DivergingBarChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type DivergingBarChartSkeletonProps = ChartSkeletonProps;

export const DivergingBarChartSkeleton: FC<DivergingBarChartSkeletonProps> = ({
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
		<SkeletonBars orientation="horizontal" seed={3.1} />
	</ChartSkeletonFrame>
);
