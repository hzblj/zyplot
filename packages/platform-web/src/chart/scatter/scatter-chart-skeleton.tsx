import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonDots } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The ScatterChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type ScatterChartSkeletonProps = ChartSkeletonProps;

export const ScatterChartSkeleton: FC<ScatterChartSkeletonProps> = ({
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
		<SkeletonDots />
	</ChartSkeletonFrame>
);
