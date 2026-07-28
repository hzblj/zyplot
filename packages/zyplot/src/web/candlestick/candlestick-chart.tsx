"use client";

import type {
	ChartCandlestickDatum,
	ChartCandlestickStyle,
} from "@hzblj/zyplot-core";
import {
	BarChart as EChartsBarChart,
	CandlestickChart as EChartsCandlestickChart,
} from "echarts/charts";
import { DataZoomComponent } from "echarts/components";
import { type FC, useMemo } from "react";
import { BarChartSkeleton } from "../bar/bar-chart-skeleton";
import { echarts } from "../shared/engine";
import { formatChartNumber } from "../shared/format";
import { ChartShell } from "../shared/frame";
import {
	buildChartAnnotationOption,
	buildChartBaseOption,
	buildChartGrid,
	buildChartInteraction,
	buildValueAxis,
	renderChartTooltip,
} from "../shared/option";
import { useChartTokens } from "../shared/tokens";
import type {
	ChartBaseProps,
	ChartNumberFormat,
	ChartSkeletonProps,
} from "../shared/types";

echarts.use([DataZoomComponent, EChartsBarChart, EChartsCandlestickChart]);

export type CandlestickChartProps = ChartBaseProps & {
	data: readonly ChartCandlestickDatum[];
	format?: ChartNumberFormat;
	showVolume?: boolean;
	style?: ChartCandlestickStyle;
};

export type CandlestickChartSkeletonProps = ChartSkeletonProps;

export const CandlestickChart: FC<CandlestickChartProps> = ({
	animation,
	annotations,
	axis,
	className,
	data,
	format,
	height,
	interaction,
	isLoading,
	onInteraction,
	plot,
	showVolume = false,
	style,
	texture,
	xAxis,
	yAxis,
}) => {
	const tokens = useChartTokens();

	const option = useMemo(() => {
		if (!tokens) {
			return null;
		}

		const upColor = style?.upColor ?? tokens.diverging.positive;
		const downColor = style?.downColor ?? tokens.diverging.negative;
		const categories = data.map((item) => item.category);
		const categoryAxis = {
			axisLabel: {
				color: tokens.label,
				fontFamily: tokens.fontFamily,
				fontSize: 11,
				hideOverlap: true,
			},
			axisLine: { lineStyle: { color: tokens.grid } },
			axisTick: { show: false },
			data: categories,
			show: (xAxis?.visible ?? axis?.x) !== false,
			type: "category" as const,
		};
		const priceAxis = {
			...buildValueAxis(tokens, yAxis?.format ?? format, yAxis),
			scale: true,
			show: (yAxis?.visible ?? axis?.y) !== false,
		};

		const candleSeries = {
			...buildChartAnnotationOption(annotations),
			data: data.map((item) => ({
				name: item.category,
				value: [item.open, item.close, item.low, item.high],
			})),
			id: "price",
			itemStyle: {
				borderColor: upColor,
				borderColor0: downColor,
				color: style?.hollowUp ? "transparent" : upColor,
				color0: downColor,
			},
			name: "Price",
			type: "candlestick" as const,
		};

		const series: any[] = [candleSeries];
		if (showVolume) {
			series.push({
				barMaxWidth: 18,
				data: data.map((item) => ({
					itemStyle: {
						color:
							item.close >= item.open
								? (style?.volumeUpColor ?? upColor)
								: (style?.volumeDownColor ?? downColor),
						opacity: 0.45,
					},
					value: item.volume ?? 0,
				})),
				id: "volume",
				name: "Volume",
				type: "bar" as const,
				xAxisIndex: 1,
				yAxisIndex: 1,
			});
		}

		return {
			...buildChartBaseOption(tokens, texture, animation),
			dataZoom: interaction?.zoom
				? [{ type: "inside" as const, xAxisIndex: showVolume ? [0, 1] : [0] }]
				: undefined,
			grid: showVolume
				? [
						{ ...buildChartGrid(false, plot), bottom: "28%" },
						{ ...buildChartGrid(true), height: "16%", top: "76%" },
					]
				: buildChartGrid(true, plot),
			series,
			tooltip: {
				...buildChartInteraction(tokens, interaction),
				formatter: (params: any) => {
					const list = Array.isArray(params) ? params : [params];
					const candle = list.find((item) => item.seriesId === "price");
					const volume = list.find((item) => item.seriesId === "volume");
					const values = candle?.value ?? [];
					return renderChartTooltip(candle?.name, [
						{ label: "Open", value: formatChartNumber(values[1], format) },
						{ label: "High", value: formatChartNumber(values[4], format) },
						{ label: "Low", value: formatChartNumber(values[3], format) },
						{ label: "Close", value: formatChartNumber(values[2], format) },
						...(volume
							? [
									{
										label: "Volume",
										value: formatChartNumber(volume.value, {
											decimals: 0,
										}),
									},
								]
							: []),
					]);
				},
				trigger: "axis" as const,
			},
			xAxis: showVolume
				? [
						{ ...categoryAxis, axisLabel: { show: false }, gridIndex: 0 },
						{ ...categoryAxis, gridIndex: 1 },
					]
				: categoryAxis,
			yAxis: showVolume
				? [
						{ ...priceAxis, gridIndex: 0 },
						{
							...buildValueAxis(tokens, undefined),
							axisLabel: { show: false },
							gridIndex: 1,
							show: false,
						},
					]
				: priceAxis,
		};
	}, [
		animation,
		annotations,
		axis,
		data,
		format,
		interaction,
		plot,
		showVolume,
		style,
		texture,
		tokens,
		xAxis,
		yAxis,
	]);

	return (
		<ChartShell
			className={className}
			height={height}
			isLoading={isLoading}
			onInteraction={onInteraction}
			option={option}
			skeleton={
				<BarChartSkeleton
					height={height}
					legendCount={0}
					xAxis={(xAxis?.visible ?? axis?.x) !== false}
					yAxis={(yAxis?.visible ?? axis?.y) !== false}
				/>
			}
		/>
	);
};
