"use client";

import { CustomChart } from "echarts/charts";
import { type FC, useMemo } from "react";
import { echarts } from "../shared/engine";
import { formatChartNumber } from "../shared/format";
import { ChartShell } from "../shared/frame";
import {
	buildCategoryAxis,
	buildChartBaseOption,
	buildChartGrid,
	buildChartTooltip,
	buildValueAxis,
	firstTooltipParam,
	renderChartTooltip,
} from "../shared/option";
import { useChartTokens } from "../shared/tokens";
import type {
	ChartBaseProps,
	ChartDumbbellRow,
	ChartNumberFormat,
} from "../shared/types";
import { DumbbellChartSkeleton } from "./dumbbell-chart-skeleton";

echarts.use([CustomChart]);

/**
 * Before → after, one row per item — the regular price against the offered one,
 * or last week against this week.
 *
 * It beats a grouped bar chart at this job because the **gap is the measurement**:
 * two bars encode two values and leave the reader to subtract, while a dumbbell
 * draws the difference as the length of the connector. Two shades of one hue, not
 * two hues: before and after are the same quantity at two times, not two series.
 *
 * Always horizontal. The item labels are names, and the connectors need to run
 * along the reading direction for the gaps to be comparable down the column.
 */

const DOT_RADIUS = 5;
const CONNECTOR_WIDTH = 2;

export type DumbbellChartProps = ChartBaseProps & {
	afterLabel: string;
	beforeLabel: string;
	format?: ChartNumberFormat;
	rows: ChartDumbbellRow[];
};

export const DumbbellChart: FC<DumbbellChartProps> = ({
	afterLabel,
	axes,
	beforeLabel,
	className,
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

		const beforeColor = tokens.muted;
		const afterColor = tokens.categorical[0] ?? tokens.muted;

		return {
			...buildChartBaseOption(tokens, texture),
			grid: buildChartGrid(false),
			series: [
				{
					data: rows.map((row, index) => [index, row.before, row.after]),
					encode: { x: [1, 2], y: 0 },
					renderItem: (_params: any, api: any) => {
						const categoryIndex = api.value(0);
						const start = api.coord([api.value(1), categoryIndex]);
						const end = api.coord([api.value(2), categoryIndex]);

						return {
							children: [
								{
									shape: { x1: start[0], x2: end[0], y1: start[1], y2: end[1] },
									style: { lineWidth: CONNECTOR_WIDTH, stroke: tokens.grid },
									type: "line",
								},
								{
									shape: { cx: start[0], cy: start[1], r: DOT_RADIUS },
									style: {
										fill: beforeColor,
										lineWidth: 1,
										stroke: tokens.surface,
									},
									type: "circle",
								},
								{
									shape: { cx: end[0], cy: end[1], r: DOT_RADIUS },
									style: {
										fill: afterColor,
										lineWidth: 1,
										stroke: tokens.surface,
									},
									type: "circle",
								},
							],
							type: "group",
						};
					},
					type: "custom" as const,
				},
			],
			tooltip: {
				...buildChartTooltip(tokens, "shadow"),
				formatter: (params: any) => {
					const item = firstTooltipParam(params);
					const row = rows[item?.dataIndex ?? 0];
					if (!row) {
						return "";
					}

					return renderChartTooltip(row.label, [
						{
							color: beforeColor,
							label: beforeLabel,
							value: formatChartNumber(row.before, format),
						},
						{
							color: afterColor,
							label: afterLabel,
							value: formatChartNumber(row.after, format),
						},
					]);
				},
				trigger: "axis",
			},
			xAxis: { ...buildValueAxis(tokens, format), show: axes?.x !== false },
			yAxis: {
				...buildCategoryAxis(
					tokens,
					rows.map((row) => row.label),
				),
				show: axes?.y !== false,
			},
		};
	}, [afterLabel, axes, beforeLabel, format, rows, texture, tokens]);

	const legend = useMemo(() => {
		if (!tokens) {
			return [];
		}

		return [
			{ color: tokens.muted, id: "before", label: beforeLabel },
			{
				color: tokens.categorical[0] ?? tokens.muted,
				id: "after",
				label: afterLabel,
			},
		];
	}, [afterLabel, beforeLabel, tokens]);

	return (
		<ChartShell
			className={className}
			height={height}
			legend={legend}
			option={option}
			isLoading={isLoading}
			skeleton={
				<DumbbellChartSkeleton
					height={height}
					legendCount={2}
					xAxis={axes?.x !== false}
					yAxis={axes?.y !== false}
				/>
			}
		/>
	);
};
