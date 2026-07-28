import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonBars } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The StackedBarChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type StackedBarChartSkeletonProps = ChartSkeletonProps & {
	orientation?: "horizontal" | "vertical";
};

export const StackedBarChartSkeleton: FC<StackedBarChartSkeletonProps> = ({
	className,
	height,
	legendCount = 0,
	orientation = "horizontal",
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
		<SkeletonBars orientation={orientation} seed={2.9} />
	</ChartSkeletonFrame>
);
