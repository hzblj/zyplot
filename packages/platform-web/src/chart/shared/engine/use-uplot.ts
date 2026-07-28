"use client";

import { type RefObject, useEffect, useRef } from "react";
import uPlot from "uplot";

/**
 * One uPlot instance, tied to one element's lifetime.
 *
 * **Why a second charting library at all.** ECharts is the general engine; uPlot
 * is a specialist that does exactly one thing — dense time series — roughly an
 * order of magnitude faster, because it never builds a scene graph. There are no
 * mark objects, no hit-test tree, no per-point state: it walks two typed arrays
 * and strokes a path. That is why it draws a hundred thousand points in a few
 * milliseconds and why it cannot draw a treemap.
 *
 * The rule for choosing: **ECharts unless the series is dense.** A dozen points
 * of monthly volume is an ECharts line chart; a year of per-minute samples is
 * this. Reaching for uPlot for the small case buys nothing and costs the richer
 * interaction model.
 *
 * uPlot takes its size at construction rather than from CSS, so the size comes
 * from a `ResizeObserver` and a re-`setSize`, not from a stylesheet.
 */

export type UPlotSetup = {
	data: uPlot.AlignedData;
	options: uPlot.Options;
};

export const useUplot = (
	setup: UPlotSetup | null,
): RefObject<HTMLDivElement | null> => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const instanceRef = useRef<uPlot | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || !setup) {
			return;
		}

		const measured = container.getBoundingClientRect();
		const instance = new uPlot(
			{
				...setup.options,
				height: Math.round(measured.height),
				width: Math.round(measured.width),
			},
			setup.data,
			container,
		);
		instanceRef.current = instance;

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry || entry.contentRect.width === 0) {
				return;
			}
			instance.setSize({
				height: Math.round(entry.contentRect.height),
				width: Math.round(entry.contentRect.width),
			});
		});
		observer.observe(container);

		return () => {
			observer.disconnect();
			instance.destroy();
			instanceRef.current = null;
		};
		// The whole setup — series colours included — is rebuilt when the theme
		// changes, and uPlot has no way to restyle a live instance. Re-creating is
		// the supported path, and it is cheap for the one case that triggers it.
	}, [setup]);

	return containerRef;
};
