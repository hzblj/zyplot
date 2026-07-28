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
	animation,
	annotations,
	categories,
	className,
	emphasisId,
	format,
	height,
	isLoading,
	isSmooth = false,
	isStacked = false,
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

		let fillOpacity = SINGLE_SERIES_FILL_OPACITY;
		let stack: string | undefined;
		if (isStacked) {
			fillOpacity = STACKED_FILL_OPACITY;
			stack = "total";
		}

		return {
			...buildChartBaseOption(tokens, texture, animation),
			grid: buildChartGrid(true, plot),
			series: series.map((item, index) => ({
				...(index === 0 ? buildChartAnnotationOption(annotations) : {}),
				areaStyle: {
					opacity: seriesStyles?.[item.id]?.fillOpacity ?? fillOpacity,
				},
				clip: plot?.clip ?? true,
				connectNulls: false,
				data: item.values,
				emphasis:
					interaction?.hover === "none"
						? { disabled: true }
						: { focus: "series" },
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
				stack,
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
				boundaryGap: false,
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
		isStacked,
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
				<AreaChartSkeleton
					height={height}
					legendCount={series.length}
					xAxis={(xAxis?.visible ?? axis?.x) !== false}
					yAxis={(yAxis?.visible ?? axis?.y) !== false}
				/>
			}
		/>
	);
};
