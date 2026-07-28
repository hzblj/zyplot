import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonDumbbell } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The DumbbellChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type DumbbellChartSkeletonProps = ChartSkeletonProps;

export const DumbbellChartSkeleton: FC<DumbbellChartSkeletonProps> = ({
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
		<SkeletonDumbbell />
	</ChartSkeletonFrame>
);
