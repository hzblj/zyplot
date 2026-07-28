import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonFunnel } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The FunnelChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type FunnelChartSkeletonProps = ChartSkeletonProps;

export const FunnelChartSkeleton: FC<FunnelChartSkeletonProps> = ({
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
		<SkeletonFunnel />
	</ChartSkeletonFrame>
);
