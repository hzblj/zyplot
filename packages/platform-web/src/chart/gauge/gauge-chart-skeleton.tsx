import type { FC } from "react";

import { ChartSkeletonFrame, SkeletonArc } from "../shared/skeleton";
import type { ChartSkeletonProps } from "../shared/types";

/**
 * The GaugeChart's placeholder — the shape it is about to be, at the height it
 * will occupy, so nothing reflows when the data lands.
 */
export type GaugeChartSkeletonProps = ChartSkeletonProps;

export const GaugeChartSkeleton: FC<GaugeChartSkeletonProps> = ({
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
		<SkeletonArc />
	</ChartSkeletonFrame>
);
