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
import { LineChartSkeleton } from "./line-chart-skeleton";

echarts.use([EChartsLineChart]);

/**
 * Trend over time, one line per series.
 *
 * Marks are 2px — thin enough that crossing lines stay readable — and symbols
 * only appear on hover, so a dense series does not turn into a row of dots. Gaps
 * in the data are drawn as gaps; ECharts' default of bridging them invents a
 * measurement that was never taken.
 */

export type LineChartProps = ChartBaseProps & {
	categories: string[];
	/**
	 * Keeps one series in colour and drops the rest to grey. Reach for it when the
	 * story is "this one moved" rather than "compare these five".
	 */
	emphasisId?: string;
	format?: ChartNumberFormat;
	/** Rounds the line. Off by default: a smoothed line implies data between the points. */
	isSmooth?: boolean;
	series: ChartSeries[];
};

export const LineChart: FC<LineChartProps> = ({
	axis,
	categories,
	className,
	emphasisId,
	format,
	height,
	isLoading,
	isSmooth = false,
	series,
	texture,
}) => {
	const tokens = useChartTokens();

	const option = useMemo(() => {
		if (!tokens) {
			return null;
		}

		return {
			...buildChartBaseOption(tokens, texture),
			grid: buildChartGrid(),
			series: series.map((item, index) => ({
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
				show: axis?.x !== false,
			},
			yAxis: { ...buildValueAxis(tokens, format), show: axis?.y !== false },
		};
	}, [axis, categories, emphasisId, format, isSmooth, series, texture, tokens]);

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
				<LineChartSkeleton
					height={height}
					legendCount={series.length}
					xAxis={axis?.x !== false}
					yAxis={axis?.y !== false}
				/>
			}
		/>
	);
};
