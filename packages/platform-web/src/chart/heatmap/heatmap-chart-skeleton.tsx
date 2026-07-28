import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonGrid } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The HeatmapChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type HeatmapChartSkeletonProps = ChartSkeletonProps;

export const HeatmapChartSkeleton: FC<HeatmapChartSkeletonProps> = ({
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
		<SkeletonGrid />
	</ChartSkeletonFrame>
);
