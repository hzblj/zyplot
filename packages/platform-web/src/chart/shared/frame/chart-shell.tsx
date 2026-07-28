"use client";

import type { EChartsCoreOption } from "echarts/core";
import type { FC, ReactNode } from "react";

import { useECharts } from "../engine";
import type { ChartLegendItem } from "../types";
import { ChartLegend } from "./chart-legend";
import { ChartReveal } from "./chart-reveal";

/**
 * The host every ECharts chart renders through: skeleton, legend, canvas.
 *
 * **The legend is not optional for two or more series.** A chart gets one whether
 * the caller asked or not, and a single series never does, because the title
 * already names it and a one-row legend is noise.
 *
 * **The skeleton also covers the pre-token frame.** `option` is null until the
 * design tokens have been read off the document, and painting a chart in
 * fallback colours only to repaint it a frame later is worse than waiting.
 */

const DEFAULT_HEIGHT = 240;

type ChartShellProps = {
	className?: string;
	height?: number;
	/** Held true by the caller while the data is in flight. */
	isLoading?: boolean;
	legend?: ChartLegendItem[];
	option: EChartsCoreOption | null;
	skeleton?: ReactNode;
};

export const ChartShell: FC<ChartShellProps> = ({
	className,
	height = DEFAULT_HEIGHT,
	isLoading = false,
	legend = [],
	option,
	skeleton,
}) => {
	const containerRef = useECharts(option);

	return (
		<ChartReveal
			className={className}
			isPending={isLoading || option === null}
			skeleton={skeleton}
		>
			{legend.length > 1 && <ChartLegend items={legend} />}
			<div className="w-full" ref={containerRef} style={{ height }} />
		</ChartReveal>
	);
};
