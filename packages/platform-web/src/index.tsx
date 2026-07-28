"use client";

import type { LineChartProps } from "@hzblj/zyplot-core";
import { defaultChartTheme } from "@hzblj/zyplot-core";
import { useEffect, useRef } from "react";
import uPlot from "uplot";

const DEFAULT_HEIGHT = 320;

const resolveCssColor = (
	host: HTMLElement,
	color: string,
	fallback: string,
): string => {
	if (!color.startsWith("var(")) {
		return color;
	}

	const probe = document.createElement("span");
	probe.style.color = color;
	probe.style.display = "none";
	host.append(probe);
	const resolved = getComputedStyle(probe).color;
	probe.remove();

	if (!resolved) {
		return fallback;
	}

	return resolved;
};

export const WebLineChart = ({
	accessibilityLabel,
	height = DEFAULT_HEIGHT,
	series,
	theme,
}: LineChartProps) => {
	const hostRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const host = hostRef.current;
		if (!host || series.length === 0) {
			return;
		}

		const resolvedTheme = { ...defaultChartTheme, ...theme };
		const axisColor = resolveCssColor(
			host,
			"var(--color-chart-axis)",
			resolvedTheme.axis,
		);
		const gridColor = resolveCssColor(
			host,
			"var(--color-chart-grid)",
			resolvedTheme.grid,
		);
		const xValues = series[0]?.data.map((point) => point.x) ?? [];
		const data: uPlot.AlignedData = [
			xValues,
			...series.map((item) => item.data.map((point) => point.y)),
		];
		const chart = new uPlot(
			{
				axes: [
					{ grid: { stroke: gridColor }, stroke: axisColor },
					{ grid: { stroke: gridColor }, stroke: axisColor },
				],
				height,
				scales: { x: { time: false } },
				series: [
					{},
					...series.map((item) => ({
						label: item.label,
						stroke: resolveCssColor(
							host,
							item.color ?? "var(--color-chart-1)",
							"#6366f1",
						),
						width: 2,
					})),
				],
				width: host.clientWidth,
			},
			data,
			host,
		);

		const observer = new ResizeObserver((entries) => {
			const width = entries[0]?.contentRect.width;
			if (width) {
				chart.setSize({ height, width });
			}
		});
		observer.observe(host);

		return () => {
			observer.disconnect();
			chart.destroy();
		};
	}, [height, series, theme]);

	return (
		<div
			aria-label={accessibilityLabel}
			ref={hostRef}
			role="img"
			style={{ minHeight: height, width: "100%" }}
		/>
	);
};
