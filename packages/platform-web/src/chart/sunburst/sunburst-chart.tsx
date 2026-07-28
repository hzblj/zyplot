"use client";

import { SunburstChart as EChartsSunburstChart } from "echarts/charts";
import { type FC, useMemo } from "react";
import { echarts } from "../shared/engine";
import { formatChartNumber } from "../shared/format";
import { ChartShell } from "../shared/frame";
import {
	buildChartBaseOption,
	buildChartTextStyle,
	buildChartTooltip,
	firstTooltipParam,
	renderChartTooltip,
} from "../shared/option";
import {
	type ChartTokens,
	seriesColor,
	useChartTokens,
} from "../shared/tokens";
import type {
	ChartBaseProps,
	ChartHierarchyNode,
	ChartNumberFormat,
} from "../shared/types";
import { SunburstChartSkeleton } from "./sunburst-chart-skeleton";

echarts.use([EChartsSunburstChart]);

/**
 * The same hierarchy as `TreemapChart`, read as rings rather than boxes.
 *
 * Choose between them by what the reader is doing: a treemap is better at
 * comparing sizes within one level, a sunburst is better at seeing **depth** —
 * how many levels the taxonomy actually has and where it branches. It is worse
 * at everything else, and it degrades badly past three rings.
 */

const MIN_LABEL_ANGLE = 14;

export type SunburstChartProps = ChartBaseProps & {
	format?: ChartNumberFormat;
	nodes: ChartHierarchyNode[];
};

type EChartsSunburstNode = {
	children?: EChartsSunburstNode[];
	itemStyle: { color: string };
	name: string;
	value?: number;
};

const toSunburstData = (
	tokens: ChartTokens,
	nodes: ChartHierarchyNode[],
	inherited?: string,
): EChartsSunburstNode[] =>
	nodes.map((node, index) => {
		const color = inherited ?? seriesColor(tokens, node, index);

		return {
			children: node.children && toSunburstData(tokens, node.children, color),
			itemStyle: { color },
			name: node.label,
			value: node.value,
		};
	});

export const SunburstChart: FC<SunburstChartProps> = ({
	className,
	format,
	height,
	isLoading,
	nodes,
	texture,
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
					data: toSunburstData(tokens, nodes),
					emphasis: { focus: "ancestor" },
					itemStyle: { borderColor: tokens.surface, borderWidth: 2 },
					label: {
						...buildChartTextStyle(tokens),
						color: tokens.surface,
						fontSize: 10,
						minAngle: MIN_LABEL_ANGLE,
						rotate: "tangential",
					},
					levels: [
						{},
						{ r: "52%", r0: "18%" },
						{ label: { position: "outside" }, r: "78%", r0: "54%" },
					],
					radius: ["18%", "78%"],
					type: "sunburst" as const,
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
	}, [format, nodes, texture, tokens]);

	return (
		<ChartShell
			className={className}
			height={height}
			option={option}
			isLoading={isLoading}
			skeleton={<SunburstChartSkeleton height={height} legendCount={0} />}
		/>
	);
};
