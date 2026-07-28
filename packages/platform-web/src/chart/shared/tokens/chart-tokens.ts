"use client";

import { useContext, useEffect, useState } from "react";

import { toCanvasColor } from "../color";
import { ChartThemeContext } from "../theme";

/**
 * The bridge between the design tokens and the two rendering engines.
 *
 * A canvas takes colour as a JS string, so `chart/*` cannot be applied the way
 * every other surface in the product applies a token — as a Tailwind class that
 * resolves through the CSS cascade. Instead the resolved values are read off the
 * document once per theme and handed to ECharts and uPlot as plain strings.
 *
 * That makes dark mode an explicit subscription rather than something that just
 * happens: `.dark` lands on `<html>`, the observer fires, every mounted chart is
 * re-painted from the new values. Without it a chart keeps its light-mode series
 * colours on a dark canvas until it happens to re-mount.
 *
 * On a P3 display the primitives resolve to `color(display-p3 …)` rather than
 * hex. Canvas 2D accepts it in every browser that also accepts it in CSS, which
 * is what the `@supports` guard around those overrides already tests for — so
 * the value is passed through untouched rather than converted back to sRGB.
 */

export type ChartDivergingTokens = {
	negative: string;
	negativeSoft: string;
	neutral: string;
	positive: string;
	positiveSoft: string;
};

export type ChartTokens = {
	axis: string;
	/**
	 * The card hairline. Not a `chart/*` token: the tooltip *is* a card, so it
	 * takes the same edge as every other card in the product.
	 */
	border: string;
	/** Slot 1…7, in the fixed order the palette defines. */
	categorical: string[];
	diverging: ChartDivergingTokens;
	/** The resolved stack — canvas cannot read `var(--font-inter)`, only a family name. */
	fontFamily: string;
	grid: string;
	label: string;
	/** The de-emphasis grey — every series that is context rather than subject. */
	muted: string;
	/** Low → high. Magnitude only. */
	sequential: string[];
	surface: string;
	track: string;
};

const CATEGORICAL_SLOTS = [1, 2, 3, 4, 5, 6, 7];
const SEQUENTIAL_STEPS = [1, 2, 3, 4, 5];

/**
 * Reads one token and normalises it to sRGB. Every colour that leaves this file
 * goes through `toCanvasColor` — on a wide-gamut display the cascade resolves
 * these to `color(display-p3 …)`, which ECharts' own parser rejects outright.
 */
const readVariable = (styles: CSSStyleDeclaration, name: string): string =>
	toCanvasColor(styles.getPropertyValue(name).trim());

/** Reads the current values off `<html>`. Browser-only — call it from an effect. */
export const readChartTokens = (
	element: Element = document.documentElement,
): ChartTokens => {
	const styles = getComputedStyle(element);

	return {
		axis: readVariable(styles, "--color-chart-axis"),
		border: readVariable(styles, "--color-border-tertiary"),
		categorical: CATEGORICAL_SLOTS.map((slot) =>
			readVariable(styles, `--color-chart-${slot}`),
		),
		diverging: {
			negative: readVariable(styles, "--color-chart-diverging-negative"),
			negativeSoft: readVariable(
				styles,
				"--color-chart-diverging-negative-soft",
			),
			neutral: readVariable(styles, "--color-chart-diverging-neutral"),
			positive: readVariable(styles, "--color-chart-diverging-positive"),
			positiveSoft: readVariable(
				styles,
				"--color-chart-diverging-positive-soft",
			),
		},
		fontFamily: styles.fontFamily,
		grid: readVariable(styles, "--color-chart-grid"),
		label: readVariable(styles, "--color-chart-label"),
		muted: readVariable(styles, "--color-chart-muted"),
		sequential: SEQUENTIAL_STEPS.map((step) =>
			readVariable(styles, `--color-chart-sequential-${step}`),
		),
		surface: readVariable(styles, "--color-chart-surface"),
		track: readVariable(styles, "--color-chart-track"),
	};
};

/**
 * The tokens for the active theme, re-read whenever the theme class changes.
 *
 * `null` until the first effect runs — there is no server-side value to give,
 * and a guessed one would paint the wrong palette for a frame.
 */
export const useChartTokens = (): ChartTokens | null => {
	const [tokens, setTokens] = useState<ChartTokens | null>(null);
	const theme = useContext(ChartThemeContext);

	useEffect(() => {
		const sync = () =>
			setTokens(
				readChartTokens(
					theme?.rootRef.current ?? document.body ?? document.documentElement,
				),
			);
		sync();

		const observer = new MutationObserver(sync);
		observer.observe(document.documentElement, {
			attributeFilter: [
				"class",
				"data-theme",
				"data-zyplot-color-mode",
				"style",
			],
			attributes: true,
			subtree: true,
		});
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		media.addEventListener("change", sync);

		return () => {
			media.removeEventListener("change", sync);
			observer.disconnect();
		};
	}, [theme]);

	return tokens;
};

/**
 * The colour for a series. `slot` is 1-based and wraps at the palette's end —
 * but wrapping is a bug the caller should have prevented, not a feature: past
 * seven series the answer is an "other" bucket or small multiples.
 */
export const seriesColor = (
	tokens: ChartTokens,
	entry: { color?: string; slot?: number },
	index: number,
): string => {
	if (entry.color) {
		return toCanvasColor(entry.color);
	}

	const resolved = entry.slot ?? index + 1;
	const offset = (resolved - 1) % tokens.categorical.length;

	return tokens.categorical[offset] ?? tokens.muted;
};

/**
 * The emphasis form: one series keeps its hue, every other one drops to the
 * de-emphasis grey.
 *
 * It is the answer to "this chart is too busy" far more often than a better
 * palette is. Categorical colour asserts that the series are all equally the
 * subject; when only one of them is, saying so is the clearer chart.
 */
export const emphasisSeriesColor = (
	tokens: ChartTokens,
	entry: { id: string; slot?: number },
	index: number,
	emphasisId?: string,
): string => {
	if (emphasisId && entry.id !== emphasisId) {
		return tokens.muted;
	}

	return seriesColor(tokens, entry, index);
};
