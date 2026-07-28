"use client";

import {
	type ChartSurface,
	mergeChartSurface,
	resolveChartSurfacePadding,
} from "@hzblj/zyplot-core";
import type { CSSProperties, FunctionComponent } from "react";
import { useChartSurface } from "../theme/chart-provider";

/**
 * Applies the `surface` contract to a chart on the web.
 *
 * Wrapping is the honest implementation rather than a shortcut: the surface is
 * defined as the box *around* the chart, so a container element is exactly what
 * it is. It also means the twenty-odd chart components stay unaware of it —
 * they render their plot, and this decides what the plot sits in.
 *
 * Nothing is emitted when no surface is in play, so charts outside a provider
 * keep the markup they had.
 */
// `FunctionComponent` rather than `ComponentType`: the latter is a union, and
// inference against it collapses to the constraint for the charts that carry
// statics, typing their props away.
export const withSurface = <Props extends { surface?: ChartSurface }>(
	Component: FunctionComponent<Props>,
) => {
	const WithSurface = ({ surface, ...props }: Props) => {
		const inherited = useChartSurface();
		const resolved = mergeChartSurface(inherited, surface);

		if (!resolved) {
			return <Component {...(props as Props)} />;
		}

		const padding = resolveChartSurfacePadding(resolved.padding);
		const style: CSSProperties = {
			background: resolved.background,
			borderColor: resolved.border?.color,
			borderStyle: resolved.border ? "solid" : undefined,
			borderWidth: resolved.border?.width,
			borderRadius: resolved.cornerRadius,
			paddingBottom: padding?.bottom,
			paddingLeft: padding?.left,
			paddingRight: padding?.right,
			paddingTop: padding?.top,
		};

		return (
			<div style={style}>
				<Component {...(props as Props)} />
			</div>
		);
	};

	WithSurface.displayName = `WithSurface(${Component.displayName ?? Component.name})`;
	// Carries `.Skeleton` and any other static through, so wrapping a chart does
	// not quietly remove `Chart.Bar.Skeleton` from the namespace.
	return Object.assign(WithSurface, Component);
};
