"use client";

import { LineChart as EChartsLineChart } from "echarts/charts";
import { type FC, useMemo } from "react";
import { echarts } from "../shared/engine";
import { ChartShell } from "../shared/frame";
import {
	buildAxisTooltipFormatter,
	buildCategoryAxis,
	buildChartAnnotationOption,
	buildChartBaseOption,
	buildChartGrid,
	buildChartInteraction,
	buildChartLegendItems,
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
	animation,
	annotations,
	categories,
	className,
	emphasisId,
	format,
	height,
	isLoading,
	isSmooth = false,
	interaction,
	onInteraction,
	plot,
	series,
	seriesStyles,
	texture,
	xAxis,
	yAxis,
}) => {
	const tokens = useChartTokens();

	const option = useMemo(() => {
		if (!tokens) {
			return null;
		}

		return {
			...buildChartBaseOption(tokens, texture, animation),
			grid: buildChartGrid(true, plot),
			series: series.map((item, index) => ({
				...(index === 0 ? buildChartAnnotationOption(annotations) : {}),
				clip: plot?.clip ?? true,
				connectNulls: false,
				data: item.values,
				emphasis:
					interaction?.hover === "none"
						? { disabled: true }
						: { focus: interaction?.hover === "series" ? "series" : "self" },
				id: item.id,
				itemStyle: {
					color:
						seriesStyles?.[item.id]?.color ??
						emphasisSeriesColor(tokens, item, index, emphasisId),
					opacity: seriesStyles?.[item.id]?.opacity,
				},
				lineStyle: {
					type: seriesStyles?.[item.id]?.strokeDash?.length
						? seriesStyles[item.id]?.strokeDash
						: undefined,
					width: seriesStyles?.[item.id]?.strokeWidth ?? 2,
				},
				name: item.label,
				showSymbol: seriesStyles?.[item.id]?.symbol !== "none",
				smooth: isSmooth,
				symbol: seriesStyles?.[item.id]?.symbol,
				symbolSize: seriesStyles?.[item.id]?.symbolSize ?? 8,
				type: "line" as const,
			})),
			tooltip: {
				...buildChartInteraction(tokens, interaction),
				formatter: buildAxisTooltipFormatter(format),
			},
			xAxis: {
				...buildCategoryAxis(tokens, categories, false, xAxis),
				show: (xAxis?.visible ?? axis?.x) !== false,
			},
			yAxis: {
				...buildValueAxis(tokens, yAxis?.format ?? format, yAxis),
				show: (yAxis?.visible ?? axis?.y) !== false,
			},
		};
	}, [
		animation,
		annotations,
		axis,
		categories,
		emphasisId,
		format,
		interaction,
		isSmooth,
		plot,
		series,
		seriesStyles,
		texture,
		tokens,
		xAxis,
		yAxis,
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
			onInteraction={onInteraction}
			skeleton={
				<LineChartSkeleton
					height={height}
					legendCount={series.length}
					xAxis={(xAxis?.visible ?? axis?.x) !== false}
					yAxis={(yAxis?.visible ?? axis?.y) !== false}
				/>
			}
		/>
	);
};
