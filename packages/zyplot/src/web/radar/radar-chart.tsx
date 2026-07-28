"use client";

import { RadarChart as EChartsRadarChart } from "echarts/charts";
import { RadarComponent } from "echarts/components";
import { type FC, useMemo } from "react";
import { echarts } from "../shared/engine";
import { formatChartNumber } from "../shared/format";
import { ChartShell } from "../shared/frame";
import {
	buildChartBaseOption,
	buildChartLegendItems,
	buildChartTextStyle,
	buildChartTooltip,
	firstTooltipParam,
	renderChartTooltip,
} from "../shared/option";
import { seriesColor, useChartTokens } from "../shared/tokens";
import type {
	ChartBaseProps,
	ChartNumberFormat,
	ChartRadarAxis,
	ChartSeries,
} from "../shared/types";
import { RadarChartSkeleton } from "./radar-chart-skeleton";

echarts.use([EChartsRadarChart, RadarComponent]);

/**
 * A profile across several independently-scaled axes — one retailer's shape
 * against another's.
 *
 * Worth being honest about: a radar plot is a **comparison of shapes**, not of
 * magnitudes. The area it encloses scales with the square of the values and with
 * the arbitrary order the axes are placed in, so it cannot answer "how much".
 * Two or three overlaid series is the useful limit; past that the polygons hide
 * each other and a grouped bar chart is the better chart.
 */

const FILL_OPACITY = 0.14;
const MAX_USEFUL_SERIES = 3;

export type RadarChartProps = ChartBaseProps & {
	axes: ChartRadarAxis[];
	format?: ChartNumberFormat;
	series: ChartSeries[];
};

export const RadarChart: FC<RadarChartProps> = ({
	axes,
	className,
	format,
	height,
	isLoading,
	series,
	texture,
}) => {
	const tokens = useChartTokens();
	const plotted = useMemo(() => series.slice(0, MAX_USEFUL_SERIES), [series]);

	const option = useMemo(() => {
		if (!tokens) {
			return null;
		}

		return {
			...buildChartBaseOption(tokens, texture),
			radar: {
				axisLine: { lineStyle: { color: tokens.grid } },
				axisName: { ...buildChartTextStyle(tokens), fontSize: 11 },
				indicator: axes.map((axis) => ({ max: axis.max, name: axis.label })),
				radius: "68%",
				splitArea: { show: false },
				splitLine: { lineStyle: { color: tokens.grid } },
			},
			series: [
				{
					data: plotted.map((item, index) => {
						const color = seriesColor(tokens, item, index);

						return {
							areaStyle: { color, opacity: FILL_OPACITY },
							itemStyle: { color },
							lineStyle: { color, width: 2 },
							name: item.label,
							value: item.values,
						};
					}),
					symbolSize: 5,
					type: "radar" as const,
				},
			],
			tooltip: {
				...buildChartTooltip(tokens),
				formatter: (params: any) => {
					const item = firstTooltipParam(params);
					const values: (number | null)[] = item?.value ?? [];

					return renderChartTooltip(
						item?.name,
						axes.map((axis, index) => ({
							label: axis.label,
							value: formatChartNumber(values[index], format),
						})),
					);
				},
				trigger: "item",
			},
		};
	}, [axes, format, plotted, texture, tokens]);

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
				<RadarChartSkeleton height={height} legendCount={plotted.length} />
			}
		/>
	);
};
