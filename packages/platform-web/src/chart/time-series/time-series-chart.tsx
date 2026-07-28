"use client";

import { type FC, useMemo } from "react";
import type uPlot from "uplot";
import { useUplot } from "../shared/engine";
import { formatChartNumber } from "../shared/format";
import { ChartLegend, ChartReveal } from "../shared/frame";
import { seriesColor, useChartTokens } from "../shared/tokens";
import type {
	ChartBaseProps,
	ChartNumberFormat,
	ChartTimePoints,
} from "../shared/types";
import { TimeSeriesChartSkeleton } from "./time-series-chart-skeleton";

/**
 * The dense-time-series chart: uPlot behind a props surface that matches the
 * ECharts charts around it.
 *
 * Use it when the point count is in the tens of thousands and a canvas scene
 * graph would drop frames — a year of per-minute samples, a live feed, anything
 * where the reader pans and zooms. For a dozen monthly points, `LineChart` is
 * the right component and this one is a downgrade: no per-mark hover, no
 * emphasis, no decals.
 *
 * The crosshair and the axis chrome are uPlot's; the legend is ours, so the
 * labels still go through `Typography`.
 */

const DEFAULT_HEIGHT = 240;
const LINE_WIDTH = 2;

export type TimeSeriesChartProps = ChartBaseProps & {
	format?: ChartNumberFormat;
	points: ChartTimePoints;
	series: { color?: string; id: string; label: string; slot?: number }[];
};

export const TimeSeriesChart: FC<TimeSeriesChartProps> = ({
	axes,
	className,
	format,
	height = DEFAULT_HEIGHT,
	isLoading,
	points,
	series,
}) => {
	const tokens = useChartTokens();

	const setup = useMemo(() => {
		if (!tokens) {
			return null;
		}

		const axisStyle = {
			font: `11px ${tokens.fontFamily}`,
			grid: { stroke: tokens.grid, width: 1 },
			stroke: tokens.label,
			ticks: { show: false },
		};

		const options: uPlot.Options = {
			axes: [
				{ ...axisStyle, show: axes?.x !== false },
				{
					...axisStyle,
					show: axes?.y !== false,
					size: 48,
					values: (_plot, splits) =>
						splits.map((split) => formatChartNumber(split, format)),
				},
			],
			cursor: { points: { size: 7, width: 1 }, y: false },
			height,
			legend: { show: false },
			// uPlot's own series-hover fill would repaint the whole plot; the
			// crosshair alone is enough and stays cheap on a dense series.
			padding: [8, 8, 0, 0],
			series: [
				{},
				...series.map((item, index) => ({
					label: item.label,
					points: { show: false },
					stroke: seriesColor(tokens, item, index),
					width: LINE_WIDTH,
				})),
			],
			width: 600,
		};

		const data = [
			points.timestamps,
			...points.values,
		] as unknown as uPlot.AlignedData;

		return { data, options };
	}, [axes, format, height, points, series, tokens]);

	const containerRef = useUplot(setup);

	const legend = useMemo(() => {
		if (!tokens) {
			return [];
		}

		return series.map((item, index) => ({
			color: seriesColor(tokens, item, index),
			id: item.id,
			label: item.label,
		}));
	}, [series, tokens]);

	return (
		<ChartReveal
			className={className}
			isPending={isLoading || setup === null}
			skeleton={
				<TimeSeriesChartSkeleton
					height={height}
					legendCount={series.length}
					xAxis={axes?.x !== false}
					yAxis={axes?.y !== false}
				/>
			}
		>
			{legend.length > 1 && <ChartLegend items={legend} />}
			<div className="w-full" ref={containerRef} style={{ height }} />
		</ChartReveal>
	);
};
