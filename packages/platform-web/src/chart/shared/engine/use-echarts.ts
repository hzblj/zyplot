"use client";

import type { EChartsCoreOption, EChartsType } from "echarts/core";
import { type RefObject, useEffect, useRef } from "react";

import { echarts } from "./echarts-core";

/**
 * One ECharts instance, tied to one element's lifetime.
 *
 * Three things here are load-bearing:
 *
 * - **Dirty-rectangle rendering is off.** `useDirtyRect: true` repaints only the
 *   region that changed, and it is tempting on a page holding twenty charts —
 *   but it mis-computes the damaged region for a moving axis pointer. The
 *   symptom is a hard vertical seam where a stale frame survives next to a fresh
 *   one, plus crosshair ghosts left at every previous pointer position. ECharts
 *   ships it opt-in for this reason. A correct full repaint beats a fast wrong
 *   one; the frame budget here is spent on `replaceMerge` and on uPlot instead.
 * - **The instance is never re-created for a new option.** `setOption` with
 *   `replaceMerge: ['series']` swaps the data and leaves the axes, grid and
 *   tooltip in place, which is both cheaper and what keeps the transition
 *   animation continuous. Disposing and re-initing on every render is the usual
 *   way React wrappers make ECharts feel slow.
 * - **Resize is observed, not listened for on `window`.** A sidebar collapsing
 *   changes a chart's width without the window ever resizing.
 */
export const useECharts = (
	option: EChartsCoreOption | null,
): RefObject<HTMLDivElement | null> => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const instanceRef = useRef<EChartsType | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}

		const instance = echarts.init(container, undefined, { renderer: "canvas" });
		instanceRef.current = instance;

		// A chart inside a collapsed panel measures 0×0; resizing to that throws
		// ECharts' layout off, and it does not recover when the panel reopens.
		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (
				!entry ||
				entry.contentRect.width === 0 ||
				entry.contentRect.height === 0
			) {
				return;
			}
			instance.resize();
		});
		observer.observe(container);

		return () => {
			observer.disconnect();
			instance.dispose();
			instanceRef.current = null;
		};
	}, []);

	useEffect(() => {
		const instance = instanceRef.current;
		if (!instance || !option) {
			return;
		}

		instance.setOption(option, { replaceMerge: ["series"] });
	}, [option]);

	return containerRef;
};
