"use client";

import { TreemapChart as EChartsTreemapChart } from "echarts/charts";
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
import { TreemapChartSkeleton } from "./treemap-chart-skeleton";

echarts.use([EChartsTreemapChart]);

/**
 * A hierarchy by size — the product taxonomy, where the shelves are nested and
 * there are far too many of them for a bar chart.
 *
 * The honest caveat: readers compare **areas** badly. A treemap is good at "these
 * three dominate and the rest is a long tail" and bad at "is this one 12 % or
 * 15 %". Use it to show structure; put the numbers in a table underneath.
 *
 * Top-level branches take categorical slots; their children inherit the parent's
 * hue, so the hierarchy is visible in the colour rather than only in the borders.
 */

export type TreemapChartProps = ChartBaseProps & {
	format?: ChartNumberFormat;
	nodes: ChartHierarchyNode[];
};

type EChartsTreeNode = {
	children?: EChartsTreeNode[];
	itemStyle: { color: string };
	name: string;
	value?: number;
};

const toTreeData = (
	tokens: ChartTokens,
	nodes: ChartHierarchyNode[],
	inherited?: string,
): EChartsTreeNode[] =>
	nodes.map((node, index) => {
		const color = inherited ?? seriesColor(tokens, node, index);

		return {
			children: node.children && toTreeData(tokens, node.children, color),
			itemStyle: { color },
			name: node.label,
			value: node.value,
		};
	});

export const TreemapChart: FC<TreemapChartProps> = ({
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
					breadcrumb: { show: false },
					data: toTreeData(tokens, nodes),
					itemStyle: {
						borderColor: tokens.surface,
						borderWidth: 2,
						gapWidth: 2,
					},
					label: {
						...buildChartTextStyle(tokens),
						color: tokens.surface,
						fontSize: 11,
						overflow: "truncate",
					},
					levels: [
						{
							itemStyle: {
								borderColor: tokens.surface,
								borderWidth: 3,
								gapWidth: 3,
							},
						},
						{
							colorSaturation: [0.4, 0.7],
							itemStyle: {
								borderColorSaturation: 0.6,
								borderWidth: 1,
								gapWidth: 1,
							},
						},
					],
					roam: false,
					type: "treemap" as const,
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
			skeleton={<TreemapChartSkeleton height={height} legendCount={0} />}
		/>
	);
};
