import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonRing } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The SunburstChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type SunburstChartSkeletonProps = ChartSkeletonProps;

export const SunburstChartSkeleton: FC<SunburstChartSkeletonProps> = ({
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
		<SkeletonRing holeRatio={0.23} sizePercent={78} />
	</ChartSkeletonFrame>
);
