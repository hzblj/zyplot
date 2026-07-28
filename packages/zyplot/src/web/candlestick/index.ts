import { BarChartSkeleton } from "../bar/bar-chart-skeleton";
import { CandlestickChart as CandlestickChartRoot } from "./candlestick-chart";

export type {
	CandlestickChartProps,
	CandlestickChartSkeletonProps,
} from "./candlestick-chart";

export const CandlestickChart = Object.assign(CandlestickChartRoot, {
	Skeleton: BarChartSkeleton,
});
