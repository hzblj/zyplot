"use client";

import type { ChartSurface } from "@hzblj/zyplot-core";
import { type FC, useMemo } from "react";
import type uPlot from "uplot";
import { useUplot } from "../shared/engine";
import { ChartReveal } from "../shared/frame";
import { seriesColor, useChartTokens } from "../shared/tokens";
import { SparklineSkeleton } from "./sparkline-skeleton";

/**
 * A trend line with no chrome, sized to sit inside a stat tile or a table row.
 *
 * No axes, no grid, no cursor, no tooltip — a sparkline is a **shape**, not a
 * chart you read values off. Adding any of those makes it an unreadably small
 * line chart instead of a legible glyph.
 *
 * uPlot rather than ECharts because a table of forty rows means forty of these,
 * and forty ECharts instances is forty scene graphs. Here each one is a path.
 */

const DEFAULT_HEIGHT = 32;
const LINE_WIDTH = 1.5;

export type SparklineProps = {
	className?: string;
	/** Container treatment. Merges over `Chart.Provider`. */
	surface?: ChartSurface;
	color?: string;
	height?: number;
	/** Held true while the trend is in flight; shows a hairline placeholder instead. */
	isLoading?: boolean;
	/** Palette slot. Defaults to the de-emphasis grey: a sparkline is context. */
	slot?: number;
	values: number[];
};

export const Sparkline: FC<SparklineProps> = ({
	className,
	color,
	height = DEFAULT_HEIGHT,
	isLoading,
	slot,
	values,
}) => {
	const tokens = useChartTokens();

	const setup = useMemo(() => {
		if (!tokens) {
			return null;
		}

		let stroke = tokens.muted;
		if (color !== undefined || slot !== undefined) {
			stroke = seriesColor(tokens, { color, slot }, 0);
		}

		const options: uPlot.Options = {
			axes: [{ show: false }, { show: false }],
			cursor: { show: false },
			height,
			legend: { show: false },
			padding: [2, 1, 2, 1],
			scales: { x: { time: false } },
			series: [{}, { points: { show: false }, stroke, width: LINE_WIDTH }],
			width: 120,
		};

		const indices = values.map((_value, index) => index);
		const data = [indices, values] as unknown as uPlot.AlignedData;

		return { data, options };
	}, [color, height, slot, tokens, values]);

	const containerRef = useUplot(setup);

	return (
		<ChartReveal
			className={className}
			isPending={isLoading === true || setup === null}
			skeleton={<SparklineSkeleton height={height} />}
		>
			<div
				aria-hidden
				className="w-full"
				ref={containerRef}
				style={{ height }}
			/>
		</ChartReveal>
	);
};
