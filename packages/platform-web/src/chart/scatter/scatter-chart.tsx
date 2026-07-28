"use client";

import { ScatterChart as EChartsScatterChart } from "echarts/charts";
import { type FC, useMemo } from "react";
import { echarts } from "../shared/engine";
import { formatChartNumber } from "../shared/format";
import { ChartShell } from "../shared/frame";
import {
	buildChartBaseOption,
	buildChartGrid,
	buildChartLegendItems,
	buildChartTooltip,
	buildValueAxis,
	firstTooltipParam,
	renderChartTooltip,
} from "../shared/option";
import { seriesColor, useChartTokens } from "../shared/tokens";
import {
	CHART_ALL_PAIRS_SERIES_LIMIT,
	type ChartBaseProps,
	type ChartNumberFormat,
	type ChartScatterSeries,
} from "../shared/types";
import { ScatterChartSkeleton } from "./scatter-chart-skeleton";

echarts.use([EChartsScatterChart]);

/**
 * Two measures against each other — price against discount depth, unit price
 * against the share of the page a placement takes.
 *
 * **This is an all-pairs form and it caps at three series.** In a bar chart only
 * neighbours ever touch, so seven hues that separate pairwise-adjacent are
 * enough; in a cloud of points every series sits next to every other one, and
 * slots 4 and up do not clear the colour-blindness floor against slot 2. Past
 * three, facet into small multiples instead of adding a fourth colour.
 *
 * Points get a surface-coloured ring so overlapping marks stay countable —
 * without it a dense cluster reads as one solid blob.
 */

const DEFAULT_SYMBOL_SIZE = 9;
const MAX_SYMBOL_SIZE = 28;
const PROGRESSIVE_THRESHOLD = 3000;

export type ScatterChartProps = ChartBaseProps & {
	series: ChartScatterSeries[];
	xFormat?: ChartNumberFormat;
	xLabel?: string;
	yFormat?: ChartNumberFormat;
	yLabel?: string;
};

const symbolSizeFor = (maxSize: number) => (value: number[]) => {
	const size = value[2];
	if (size === undefined || maxSize === 0) {
		return DEFAULT_SYMBOL_SIZE;
	}

	return (
		DEFAULT_SYMBOL_SIZE +
		(size / maxSize) * (MAX_SYMBOL_SIZE - DEFAULT_SYMBOL_SIZE)
	);
};

export const ScatterChart: FC<ScatterChartProps> = ({
	axes,
	className,
	height,
	isLoading,
	series,
	texture,
	xFormat,
	xLabel,
	yFormat,
	yLabel,
}) => {
	const tokens = useChartTokens();
	const plotted = useMemo(
		() => series.slice(0, CHART_ALL_PAIRS_SERIES_LIMIT),
		[series],
	);

	const option = useMemo(() => {
		if (!tokens) {
			return null;
		}

		const maxSize = Math.max(
			0,
			...plotted.flatMap((item) => item.points.map((point) => point.size ?? 0)),
		);

		return {
			...buildChartBaseOption(tokens, texture),
			grid: buildChartGrid(),
			series: plotted.map((item, index) => ({
				data: item.points.map((point) => [
					point.x,
					point.y,
					point.size ?? 0,
					point.label ?? "",
				]),
				emphasis: { focus: "series" },
				itemStyle: {
					borderColor: tokens.surface,
					borderWidth: 1,
					color: seriesColor(tokens, item, index),
					opacity: 0.9,
				},
				name: item.label,
				// Past a few thousand points ECharts renders in chunks across frames
				// rather than blocking on one long paint.
				progressive: PROGRESSIVE_THRESHOLD,
				progressiveThreshold: PROGRESSIVE_THRESHOLD,
				symbolSize: symbolSizeFor(maxSize),
				type: "scatter" as const,
			})),
			tooltip: {
				...buildChartTooltip(tokens),
				formatter: (params: any) => {
					const item = firstTooltipParam(params);
					const value = item?.value ?? [];

					return renderChartTooltip(value[3] || item?.seriesName, [
						{
							color: item?.color,
							label: xLabel ?? "",
							value: formatChartNumber(value[0], xFormat),
						},
						{
							label: yLabel ?? "",
							value: formatChartNumber(value[1], yFormat),
						},
					]);
				},
				trigger: "item",
			},
			xAxis: {
				...buildValueAxis(tokens, xFormat),
				show: axes?.x !== false,
				splitLine: { lineStyle: { color: tokens.grid } },
			},
			yAxis: { ...buildValueAxis(tokens, yFormat), show: axes?.y !== false },
		};
	}, [axes, plotted, texture, tokens, xFormat, xLabel, yFormat, yLabel]);

	const legend = useMemo(() => {
		if (!tokens) {
			return [];
		}

		return buildChartLegendItems(tokens, plotted);
	}, [plotted, tokens]);

	return (
		<ChartShell
			className={className}
			height={height}
			legend={legend}
			option={option}
			isLoading={isLoading}
			skeleton={
				<ScatterChartSkeleton
					height={height}
					legendCount={plotted.length}
					xAxis={axes?.x !== false}
					yAxis={axes?.y !== false}
				/>
			}
		/>
	);
};
