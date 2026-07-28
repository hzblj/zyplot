"use client";

import { PieChart as EChartsPieChart } from "echarts/charts";
import { type FC, useMemo } from "react";
import { echarts } from "../shared/engine";
import { formatChartNumber } from "../shared/format";
import { ChartShell } from "../shared/frame";
import {
	buildChartBaseOption,
	buildChartLegendItems,
	buildChartTooltip,
	firstTooltipParam,
	renderChartTooltip,
} from "../shared/option";
import { seriesColor, useChartTokens } from "../shared/tokens";
import type {
	ChartBaseProps,
	ChartDatum,
	ChartNumberFormat,
} from "../shared/types";
import { PieChartSkeleton } from "./pie-chart-skeleton";

echarts.use([EChartsPieChart]);

/**
 * Part-to-whole for **two or three slices**, and a donut by default.
 *
 * Past three slices a human cannot rank angles, and this chart stops trying to
 * help: it folds the tail into a single "other" slice using `maxSlices`. If the
 * tail is the point, the form is wrong — use `StackedBarChart`, which ranks and
 * compares at the same time.
 *
 * The donut hole is not decoration. It removes the angle-at-the-centre cue that
 * makes a full pie read as more precise than it is, and it gives the total
 * somewhere to live.
 */

const DEFAULT_MAX_SLICES = 3;
const SEGMENT_GAP = 2;

export type PieChartProps = ChartBaseProps & {
	data: ChartDatum[];
	format?: ChartNumberFormat;
	/** Fills the centre. A full pie invites angle comparisons it cannot support. */
	isSolid?: boolean;
	/** Slices kept before the tail is folded into `otherLabel`. Defaults to three. */
	maxSlices?: number;
	/** Already-translated name for the folded tail. Required once folding can happen. */
	otherLabel?: string;
};

const foldTail = (
	data: ChartDatum[],
	maxSlices: number,
	otherLabel: string | undefined,
): ChartDatum[] => {
	if (data.length <= maxSlices || !otherLabel) {
		return data;
	}

	const kept = data.slice(0, maxSlices);
	const tail = data.slice(maxSlices);
	const total = tail.reduce((sum, entry) => sum + entry.value, 0);

	return [
		...kept,
		{ id: "other", label: otherLabel, slot: kept.length + 1, value: total },
	];
};

export const PieChart: FC<PieChartProps> = ({
	className,
	data,
	format,
	height,
	isLoading,
	isSolid = false,
	maxSlices = DEFAULT_MAX_SLICES,
	otherLabel,
	texture,
}) => {
	const tokens = useChartTokens();
	const slices = useMemo(
		() => foldTail(data, maxSlices, otherLabel),
		[data, maxSlices, otherLabel],
	);

	const option = useMemo(() => {
		if (!tokens) {
			return null;
		}

		let radius = ["58%", "82%"];
		if (isSolid) {
			radius = ["0%", "82%"];
		}

		return {
			...buildChartBaseOption(tokens, texture),
			series: [
				{
					avoidLabelOverlap: true,
					data: slices.map((entry, index) => ({
						itemStyle: {
							borderColor: tokens.surface,
							borderWidth: SEGMENT_GAP,
							color: seriesColor(tokens, entry, index),
						},
						name: entry.label,
						value: entry.value,
					})),
					label: { show: false },
					radius,
					type: "pie" as const,
				},
			],
			tooltip: {
				...buildChartTooltip(tokens),
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
				trigger: "item",
			},
		};
	}, [format, isSolid, slices, texture, tokens]);

	const legend = useMemo(() => {
		if (!tokens) {
			return [];
		}

		return buildChartLegendItems(tokens, slices);
	}, [slices, tokens]);

	return (
		<ChartShell
			className={className}
			height={height}
			legend={legend}
			option={option}
			isLoading={isLoading}
			skeleton={
				<PieChartSkeleton height={height} legendCount={slices.length} />
			}
		/>
	);
};
