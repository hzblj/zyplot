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
import { StackedBarChartSkeleton } from "./stacked-bar-chart-skeleton";

echarts.use([EChartsBarChart]);

/**
 * Part-to-whole — and the right answer for anything a pie chart was reached for
 * with more than three slices.
 *
 * `horizontal` is the default here, unlike `BarChart`: composition categories are
 * usually named things ("loyalty price", "multibuy", "clearance") rather than
 * dates, and horizontal is what lets those names be read straight.
 *
 * Segments are separated by a 1px stroke in the surface colour, which reads as a
 * 2px gap between neighbours. Without it two adjacent fills of similar lightness
 * merge into one band and the composition is a guess.
 */

const SEGMENT_GAP = 1;

export type StackedBarChartProps = ChartBaseProps & {
	categories: string[];
	/** Keeps one series in colour and drops the rest to grey. */
	emphasisId?: string;
	format?: ChartNumberFormat;
	/** Normalises every stack to 100 %. Compares shape, not size. */
	isNormalized?: boolean;
	orientation?: "horizontal" | "vertical";
	series: ChartSeries[];
};

const toPercentSeries = (series: ChartSeries[]): ChartSeries[] => {
	const totals = series[0]?.values.map((_, index) =>
		series.reduce((sum, item) => sum + (item.values[index] ?? 0), 0),
	);

	return series.map((item) => ({
		...item,
		values: item.values.map((value, index) => {
			const total = totals?.[index] ?? 0;
			if (total === 0 || value === null) {
				return null;
			}

			return (value / total) * 100;
		}),
	}));
};

export const StackedBarChart: FC<StackedBarChartProps> = ({
	axis,
	categories,
	className,
	emphasisId,
	format,
	height,
	isLoading,
	isNormalized = false,
	orientation = "horizontal",
	series,
	texture,
}) => {
	const tokens = useChartTokens();

	const option = useMemo(() => {
		if (!tokens) {
			return null;
		}

		const isHorizontal = orientation === "horizontal";
		let plotted = series;
		let valueFormat = format;
		if (isNormalized) {
			plotted = toPercentSeries(series);
			valueFormat = { ...format, decimals: 0, prefix: undefined, suffix: "%" };
		}

		return {
			...buildChartBaseOption(tokens, texture),
			...buildCartesianAxes(
				tokens,
				categories,
				valueFormat,
				isHorizontal,
				axis,
			),
			grid: buildChartGrid(!isHorizontal),
			series: plotted.map((item, index) => ({
				barMaxWidth: 28,
				data: item.values,
				emphasis: { focus: "series" },
				itemStyle: {
					borderColor: tokens.surface,
					borderWidth: SEGMENT_GAP,
					color: emphasisSeriesColor(tokens, item, index, emphasisId),
				},
				name: item.label,
				stack: "total",
				type: "bar" as const,
			})),
			tooltip: {
				...buildChartTooltip(tokens, "shadow"),
				formatter: buildAxisTooltipFormatter(valueFormat),
				trigger: "axis",
			},
		};
	}, [
		axis,
		categories,
		emphasisId,
		format,
		isNormalized,
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
				<StackedBarChartSkeleton
					height={height}
					legendCount={series.length}
					orientation={orientation}
					xAxis={axis?.x !== false}
					yAxis={axis?.y !== false}
				/>
			}
		/>
	);
};
