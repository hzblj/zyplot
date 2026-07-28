import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonBlocks } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The TreemapChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type TreemapChartSkeletonProps = ChartSkeletonProps;

export const TreemapChartSkeleton: FC<TreemapChartSkeletonProps> = ({
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
		<SkeletonBlocks count={6} />
	</ChartSkeletonFrame>
);
