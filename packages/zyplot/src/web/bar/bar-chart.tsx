"use client";

import { BarChart as EChartsBarChart } from "echarts/charts";
import { type FC, useMemo } from "react";
import { echarts } from "../shared/engine";
import { ChartShell } from "../shared/frame";
import {
	buildAxisTooltipFormatter,
	buildCartesianAxes,
	buildChartAnnotationOption,
	buildChartBaseOption,
	buildChartGrid,
	buildChartInteraction,
	buildChartLegendItems,
} from "../shared/option";
import { emphasisSeriesColor, useChartTokens } from "../shared/tokens";
import type {
	ChartBaseProps,
	ChartNumberFormat,
	ChartSeries,
} from "../shared/types";
import { BarChartSkeleton } from "./bar-chart-skeleton";

echarts.use([EChartsBarChart]);

/**
 * Compare magnitude across categories, grouped when there is more than one series.
 *
 * Go `horizontal` for long category names — Czech retailer and category names
 * rotate to 40° in the vertical form and become a wall of diagonal text. The
 * rounded end is on the growth end only; rounding the baseline end would lift
 * the bar off the axis it is measured against.
 */

const BAR_RADIUS = 4;

export type BarChartOrientation = "horizontal" | "vertical";

export type BarChartProps = ChartBaseProps & {
	categories: string[];
	/** Keeps one series in colour and drops the rest to grey. */
	emphasisId?: string;
	format?: ChartNumberFormat;
	orientation?: BarChartOrientation;
	series: ChartSeries[];
};

/** Rounds the growth end only, so the bar stays anchored to its baseline. */
const barRadiusFor = (orientation: BarChartOrientation): number[] => {
	if (orientation === "horizontal") {
		return [0, BAR_RADIUS, BAR_RADIUS, 0];
	}

	return [BAR_RADIUS, BAR_RADIUS, 0, 0];
};

export const BarChart: FC<BarChartProps> = ({
	axis,
	animation,
	annotations,
	categories,
	className,
	emphasisId,
	format,
	height,
	isLoading,
	interaction,
	onInteraction,
	orientation = "vertical",
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

		const isHorizontal = orientation === "horizontal";

		return {
			...buildChartBaseOption(tokens, texture, animation),
			...buildCartesianAxes(
				tokens,
				categories,
				format,
				isHorizontal,
				axis,
				xAxis,
				yAxis,
			),
			grid: buildChartGrid(!isHorizontal, plot),
			series: series.map((item, index) => ({
				...(index === 0 ? buildChartAnnotationOption(annotations) : {}),
				barGap: "12%",
				barMaxWidth: 28,
				clip: plot?.clip ?? true,
				data: item.values,
				emphasis:
					interaction?.hover === "none"
						? { disabled: true }
						: { focus: "series" },
				id: item.id,
				itemStyle: {
					borderRadius: barRadiusFor(orientation),
					color:
						seriesStyles?.[item.id]?.color ??
						emphasisSeriesColor(tokens, item, index, emphasisId),
					opacity: seriesStyles?.[item.id]?.opacity,
				},
				name: item.label,
				type: "bar" as const,
			})),
			tooltip: {
				...buildChartInteraction(tokens, {
					crosshair: "none",
					hover: "axis",
					...interaction,
				}),
				formatter: buildAxisTooltipFormatter(format),
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
		orientation,
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
				<BarChartSkeleton
					height={height}
					legendCount={series.length}
					orientation={orientation}
					xAxis={(xAxis?.visible ?? axis?.x) !== false}
					yAxis={(yAxis?.visible ?? axis?.y) !== false}
				/>
			}
		/>
	);
};
