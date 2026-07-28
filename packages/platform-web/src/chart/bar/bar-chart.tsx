"use client";

import { BarChart as EChartsBarChart } from "echarts/charts";
import { type FC, useMemo } from "react";
import { echarts } from "../shared/engine";
import { ChartShell } from "../shared/frame";
import {
	buildAxisTooltipFormatter,
	buildCartesianAxes,
	buildChartBaseOption,
	buildChartGrid,
	buildChartLegendItems,
	buildChartTooltip,
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
	axes,
	categories,
	className,
	emphasisId,
	format,
	height,
	isLoading,
	orientation = "vertical",
	series,
	texture,
}) => {
	const tokens = useChartTokens();

	const option = useMemo(() => {
		if (!tokens) {
			return null;
		}

		const isHorizontal = orientation === "horizontal";

		return {
			...buildChartBaseOption(tokens, texture),
			...buildCartesianAxes(tokens, categories, format, isHorizontal, axes),
			grid: buildChartGrid(!isHorizontal),
			series: series.map((item, index) => ({
				barGap: "12%",
				barMaxWidth: 28,
				data: item.values,
				emphasis: { focus: "series" },
				itemStyle: {
					borderRadius: barRadiusFor(orientation),
					color: emphasisSeriesColor(tokens, item, index, emphasisId),
				},
				name: item.label,
				type: "bar" as const,
			})),
			tooltip: {
				...buildChartTooltip(tokens, "shadow"),
				formatter: buildAxisTooltipFormatter(format),
				trigger: "axis",
			},
		};
	}, [
		axes,
		categories,
		emphasisId,
		format,
		orientation,
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
				<BarChartSkeleton
					height={height}
					legendCount={series.length}
					orientation={orientation}
					xAxis={axes?.x !== false}
					yAxis={axes?.y !== false}
				/>
			}
		/>
	);
};
