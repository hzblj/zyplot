import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonBlocks } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The SankeyChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type SankeyChartSkeletonProps = ChartSkeletonProps;

export const SankeyChartSkeleton: FC<SankeyChartSkeletonProps> = ({
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
		<SkeletonBlocks />
	</ChartSkeletonFrame>
);
