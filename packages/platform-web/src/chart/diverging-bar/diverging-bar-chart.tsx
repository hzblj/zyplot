"use client";

import { BarChart as EChartsBarChart } from "echarts/charts";
import { type FC, useMemo } from "react";
import { echarts } from "../shared/engine";
import { formatChartNumber } from "../shared/format";
import { ChartShell } from "../shared/frame";
import {
	buildCartesianAxes,
	buildChartBaseOption,
	buildChartGrid,
	buildChartTooltip,
	firstTooltipParam,
	renderChartTooltip,
} from "../shared/option";
import { useChartTokens } from "../shared/tokens";
import type {
	ChartBaseProps,
	ChartDatum,
	ChartNumberFormat,
} from "../shared/types";
import { DivergingBarChartSkeleton } from "./diverging-bar-chart-skeleton";

echarts.use([EChartsBarChart]);

/**
 * Δ against a baseline — above/below target, week-over-week, a retailer against
 * its own median.
 *
 * The two poles are orange and blue rather than red and green. Red↔green is the
 * one pair a red-green colour-blind reader cannot separate at all, and it is
 * also the pair most charts reach for first. The zero line is drawn explicitly:
 * a diverging chart whose baseline is implied is a chart whose sign is a guess.
 */

const BAR_RADIUS = 4;

/** The zero line runs across whichever axis carries the values. */
const baselineFor = (isHorizontal: boolean) => {
	if (isHorizontal) {
		return { xAxis: 0 };
	}

	return { yAxis: 0 };
};

export type DivergingBarChartProps = ChartBaseProps & {
	data: ChartDatum[];
	format?: ChartNumberFormat;
	orientation?: "horizontal" | "vertical";
};

export const DivergingBarChart: FC<DivergingBarChartProps> = ({
	axes,
	className,
	data,
	format,
	height,
	isLoading,
	orientation = "horizontal",
	texture,
}) => {
	const tokens = useChartTokens();

	const option = useMemo(() => {
		if (!tokens) {
			return null;
		}

		const isHorizontal = orientation === "horizontal";
		const categories = data.map((entry) => entry.label);

		const bars = data.map((entry) => {
			let color = tokens.diverging.positive;
			let borderRadius = [BAR_RADIUS, BAR_RADIUS, 0, 0];
			if (entry.value < 0) {
				color = tokens.diverging.negative;
				borderRadius = [0, 0, BAR_RADIUS, BAR_RADIUS];
			}
			if (isHorizontal) {
				borderRadius = [0, BAR_RADIUS, BAR_RADIUS, 0];
				if (entry.value < 0) {
					borderRadius = [BAR_RADIUS, 0, 0, BAR_RADIUS];
				}
			}

			return { itemStyle: { borderRadius, color }, value: entry.value };
		});

		return {
			...buildChartBaseOption(tokens, texture),
			...buildCartesianAxes(tokens, categories, format, isHorizontal, axes),
			grid: buildChartGrid(!isHorizontal),
			series: [
				{
					barMaxWidth: 24,
					data: bars,
					markLine: {
						data: [baselineFor(isHorizontal)],
						label: { show: false },
						lineStyle: {
							color: tokens.diverging.neutral,
							type: "solid",
							width: 1,
						},
						silent: true,
						symbol: "none",
					},
					type: "bar" as const,
				},
			],
			tooltip: {
				...buildChartTooltip(tokens, "shadow"),
				formatter: (params: any) => {
					const item = firstTooltipParam(params);

					return renderChartTooltip(undefined, [
						{
							color: item?.color,
							label: item?.name ?? "",
							value: formatChartNumber(item?.value, format),
						},
					]);
				},
				trigger: "axis",
			},
		};
	}, [axes, data, format, orientation, texture, tokens]);

	return (
		<ChartShell
			className={className}
			height={height}
			option={option}
			isLoading={isLoading}
			skeleton={
				<DivergingBarChartSkeleton
					height={height}
					legendCount={0}
					xAxis={axes?.x !== false}
					yAxis={axes?.y !== false}
				/>
			}
		/>
	);
};
