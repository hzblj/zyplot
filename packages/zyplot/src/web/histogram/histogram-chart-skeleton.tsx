import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonBars } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The HistogramChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type HistogramChartSkeletonProps = ChartSkeletonProps;

export const HistogramChartSkeleton: FC<HistogramChartSkeletonProps> = ({
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
		<SkeletonBars count={12} seed={0.9} />
	</ChartSkeletonFrame>
);
