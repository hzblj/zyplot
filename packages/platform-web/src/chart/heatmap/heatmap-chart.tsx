"use client";

import { HeatmapChart as EChartsHeatmapChart } from "echarts/charts";
import { VisualMapComponent } from "echarts/components";
import { type FC, useMemo } from "react";
import { echarts } from "../shared/engine";
import { formatChartNumber } from "../shared/format";
import { ChartShell } from "../shared/frame";
import {
	buildCategoryAxis,
	buildChartBaseOption,
	buildChartGrid,
	buildChartTooltip,
	firstTooltipParam,
	renderChartTooltip,
} from "../shared/option";
import { useChartTokens } from "../shared/tokens";
import type {
	ChartBaseProps,
	ChartHeatmapCell,
	ChartNumberFormat,
} from "../shared/types";
import { HeatmapChartSkeleton } from "./heatmap-chart-skeleton";

echarts.use([EChartsHeatmapChart, VisualMapComponent]);

/**
 * Magnitude across a grid — retailer × week, category × store format.
 *
 * This is the form that scales where a multi-series line chart collapses: twelve
 * retailers over a year is 12 unreadable lines, or 624 legible cells. Colour is
 * **sequential** — one hue, more-is-darker — because a heatmap encodes magnitude,
 * never identity. A rainbow grid looks informative and cannot be read.
 *
 * `VisualMapComponent` is not optional: a cartesian heatmap throws "Heatmap must
 * use with visualMap" without one, and per-cell `itemStyle` colours do not
 * satisfy it. Its own UI is hidden (`show: false`) — the ramp is fed from the
 * `chart/sequential/*` tokens and the scale is explained in the caption, so
 * ECharts never paints a control this design system did not design.
 */

const CELL_GAP = 1;

export type HeatmapChartProps = ChartBaseProps & {
	cells: ChartHeatmapCell[];
	columns: string[];
	format?: ChartNumberFormat;
	rows: string[];
};

export const HeatmapChart: FC<HeatmapChartProps> = ({
	axes,
	cells,
	className,
	columns,
	format,
	height,
	isLoading,
	rows,
	texture,
}) => {
	const tokens = useChartTokens();

	const option = useMemo(() => {
		if (!tokens) {
			return null;
		}

		const present = cells.filter((cell) => cell.value !== null);
		const values = present.map((cell) => cell.value as number);
		const min = Math.min(...values);
		const max = Math.max(...values);

		return {
			...buildChartBaseOption(tokens, texture),
			grid: buildChartGrid(),
			series: [
				{
					data: present.map((cell) => [
						cell.columnIndex,
						cell.rowIndex,
						cell.value,
					]),
					itemStyle: { borderColor: tokens.surface, borderWidth: CELL_GAP },
					type: "heatmap" as const,
				},
			],
			tooltip: {
				...buildChartTooltip(tokens),
				formatter: (params: any) => {
					const item = firstTooltipParam(params);
					const value = item?.value ?? [];
					const heading = `${rows[value[1]] ?? ""} · ${columns[value[0]] ?? ""}`;

					return renderChartTooltip(heading, [
						{
							color: item?.color,
							label: columns[value[0]] ?? "",
							value: formatChartNumber(value[2], format),
						},
					]);
				},
				trigger: "item",
			},
			visualMap: {
				calculable: false,
				inRange: { color: tokens.sequential },
				max,
				min,
				show: false,
				type: "continuous" as const,
			},
			xAxis: {
				...buildCategoryAxis(tokens, columns),
				show: axes?.x !== false,
				splitArea: { show: false },
			},
			yAxis: {
				...buildCategoryAxis(tokens, rows),
				show: axes?.y !== false,
				splitArea: { show: false },
			},
		};
	}, [axes, cells, columns, format, rows, texture, tokens]);

	return (
		<ChartShell
			className={className}
			height={height}
			option={option}
			isLoading={isLoading}
			skeleton={
				<HeatmapChartSkeleton
					height={height}
					legendCount={0}
					xAxis={axes?.x !== false}
					yAxis={axes?.y !== false}
				/>
			}
		/>
	);
};
