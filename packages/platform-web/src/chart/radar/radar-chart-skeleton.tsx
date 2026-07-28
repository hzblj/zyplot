import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonPolygon } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The RadarChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type RadarChartSkeletonProps = ChartSkeletonProps;

export const RadarChartSkeleton: FC<RadarChartSkeletonProps> = ({
	className,
	height,
	legendCount = 0,
}) => (
	<ChartSkeletonFrame
		className={className}
		xAxis={false}
		yAxis={false}
		height={height}
		legendCount={legendCount}
	>
		<SkeletonPolygon />
	</ChartSkeletonFrame>
);
