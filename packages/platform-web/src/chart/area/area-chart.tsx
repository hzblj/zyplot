"use client";

import { LineChart as EChartsLineChart } from "echarts/charts";
import { type FC, useMemo } from "react";
import { echarts } from "../shared/engine";
import { ChartShell } from "../shared/frame";
import {
	buildAxisTooltipFormatter,
	buildCategoryAxis,
	buildChartBaseOption,
	buildChartGrid,
	buildChartLegendItems,
	buildChartTooltip,
	buildValueAxis,
} from "../shared/option";
import { emphasisSeriesColor, useChartTokens } from "../shared/tokens";
import type {
	ChartBaseProps,
	ChartNumberFormat,
	ChartSeries,
} from "../shared/types";
import { AreaChartSkeleton } from "./area-chart-skeleton";

echarts.use([EChartsLineChart]);

/**
 * Volume over time.
 *
 * A filled area says "how much", which is why a single series is the honest use
 * — the fill reads as the quantity itself. Stacking turns it into composition
 * over time, and it is opt-in: stacked areas make every band above the first
 * hard to read individually, so it is a deliberate choice rather than what you
 * get by passing a second series.
 */

const SINGLE_SERIES_FILL_OPACITY = 0.16;
const STACKED_FILL_OPACITY = 0.85;

export type AreaChartProps = ChartBaseProps & {
	categories: string[];
	/** Keeps one series in colour and drops the rest to grey. */
	emphasisId?: string;
	format?: ChartNumberFormat;
	isSmooth?: boolean;
	/** Composition over time. Without it, several series overlap and hide each other. */
	isStacked?: boolean;
	series: ChartSeries[];
};

export const AreaChart: FC<AreaChartProps> = ({
	axis,
	categories,
	className,
	emphasisId,
	format,
	height,
	isLoading,
	isSmooth = false,
	isStacked = false,
	series,
	texture,
}) => {
	const tokens = useChartTokens();

	const option = useMemo(() => {
		if (!tokens) {
			return null;
		}

		let fillOpacity = SINGLE_SERIES_FILL_OPACITY;
		let stack: string | undefined;
		if (isStacked) {
			fillOpacity = STACKED_FILL_OPACITY;
			stack = "total";
		}

		return {
			...buildChartBaseOption(tokens, texture),
			grid: buildChartGrid(),
			series: series.map((item, index) => ({
				areaStyle: { opacity: fillOpacity },
				connectNulls: false,
				data: item.values,
				emphasis: { focus: "series" },
				itemStyle: {
					color: emphasisSeriesColor(tokens, item, index, emphasisId),
				},
				lineStyle: { width: 2 },
				name: item.label,
				showSymbol: false,
				smooth: isSmooth,
				stack,
				symbolSize: 8,
				type: "line" as const,
			})),
			tooltip: {
				...buildChartTooltip(tokens, "line"),
				formatter: buildAxisTooltipFormatter(format),
				trigger: "axis",
			},
			xAxis: {
				...buildCategoryAxis(tokens, categories),
				boundaryGap: false,
				show: axis?.x !== false,
			},
			yAxis: { ...buildValueAxis(tokens, format), show: axis?.y !== false },
		};
	}, [
		axis,
		categories,
		emphasisId,
		format,
		isSmooth,
		isStacked,
		series,
		texture,
		tokens,
	]);

	const legend = useMemo(() => {
		if (!tokens) {
			return [];
		}

		return buildChartLegendItems(tokens, series, emphasisId);
	}, [emphasisId, series, tokens]);

	return (
		<ChartShell
			className={className}
			height={height}
			legend={legend}
			option={option}
			isLoading={isLoading}
			skeleton={
				<AreaChartSkeleton
					height={height}
					legendCount={series.length}
					xAxis={axis?.x !== false}
					yAxis={axis?.y !== false}
				/>
			}
		/>
	);
};
