"use client";

import { GaugeChart as EChartsGaugeChart } from "echarts/charts";
import { type FC, useMemo } from "react";
import { echarts } from "../shared/engine";
import { formatChartNumber } from "../shared/format";
import { ChartShell } from "../shared/frame";
import { buildChartBaseOption, buildChartTextStyle } from "../shared/option";
import { useChartTokens } from "../shared/tokens";
import type { ChartBaseProps, ChartNumberFormat } from "../shared/types";
import { GaugeChartSkeleton } from "./gauge-chart-skeleton";

echarts.use([EChartsGaugeChart]);

/**
 * One ratio against its limit, as an arc — extraction coverage, pages processed,
 * a quota.
 *
 * A gauge is a **single number with a bound**, and that is all it should ever
 * carry. No needle, no coloured zones, no second series: the ring is the track,
 * the arc is the value, and the number in the middle is what the reader actually
 * came for. If there is no meaningful maximum, this is a stat tile, not a gauge.
 */

const ARC_WIDTH = 12;

export type GaugeChartProps = ChartBaseProps & {
	format?: ChartNumberFormat;
	max: number;
	min?: number;
	value: number;
};

export const GaugeChart: FC<GaugeChartProps> = ({
	className,
	format,
	height = 200,
	isLoading,
	max,
	min = 0,
	texture,
	value,
}) => {
	const tokens = useChartTokens();

	const option = useMemo(() => {
		if (!tokens) {
			return null;
		}

		return {
			...buildChartBaseOption(tokens, texture),
			series: [
				{
					anchor: { show: false },
					axisLabel: { show: false },
					axisLine: {
						lineStyle: { color: [[1, tokens.track]], width: ARC_WIDTH },
					},
					axisTick: { show: false },
					data: [{ value }],
					detail: {
						...buildChartTextStyle(tokens),
						color: tokens.categorical[0],
						fontSize: 22,
						formatter: () => formatChartNumber(value, format),
						offsetCenter: [0, 0],
					},
					endAngle: -45,
					itemStyle: { color: tokens.categorical[0] },
					max,
					min,
					pointer: { show: false },
					progress: {
						itemStyle: { borderRadius: ARC_WIDTH },
						roundCap: true,
						show: true,
						width: ARC_WIDTH,
					},
					splitLine: { show: false },
					startAngle: 225,
					title: { show: false },
					type: "gauge" as const,
				},
			],
		};
	}, [format, max, min, texture, tokens, value]);

	return (
		<ChartShell
			className={className}
			height={height}
			option={option}
			isLoading={isLoading}
			skeleton={<GaugeChartSkeleton height={height} legendCount={0} />}
		/>
	);
};
