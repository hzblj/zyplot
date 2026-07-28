/**
 * The box a chart is drawn in, as opposed to what is drawn inside it.
 *
 * `theme` answers "what colour is this series"; `surface` answers "what does
 * the container look like". Keeping them apart is what lets a design system set
 * one card treatment for every chart while each chart keeps its own palette.
 *
 * Deliberately small: only properties that mean the same thing to a `<div>`, a
 * SwiftUI view and a Compose `Canvas`. Anything that would have to be
 * approximated on one of the three does not belong here.
 */
export type ChartSurface = {
	background?: string;
	border?: {
		color?: string;
		width?: number;
	};
	cornerRadius?: number;
	/**
	 * A number applies to all four sides. Native measures in points/dp and the
	 * web in pixels, which line up at the scale charts are used.
	 */
	padding?: number | ChartSurfacePadding;
};

export type ChartSurfacePadding = {
	bottom?: number;
	horizontal?: number;
	left?: number;
	right?: number;
	top?: number;
	vertical?: number;
};

/**
 * Flattens the shorthand into the four sides the renderers actually apply.
 * `left`/`right`/`top`/`bottom` win over `horizontal`/`vertical`, which win
 * over the all-sides number — most specific wins, as in CSS.
 */
export const resolveChartSurfacePadding = (
	padding: ChartSurface["padding"],
): { bottom: number; left: number; right: number; top: number } | undefined => {
	if (padding === undefined) {
		return undefined;
	}
	if (typeof padding === "number") {
		return { bottom: padding, left: padding, right: padding, top: padding };
	}
	const { bottom, horizontal, left, right, top, vertical } = padding;
	return {
		bottom: bottom ?? vertical ?? 0,
		left: left ?? horizontal ?? 0,
		right: right ?? horizontal ?? 0,
		top: top ?? vertical ?? 0,
	};
};

/**
 * Chart-level values win over the provider's, key by key, so a chart can round
 * its own corners without restating the background it inherits.
 */
export const mergeChartSurface = (
	base: ChartSurface | undefined,
	override: ChartSurface | undefined,
): ChartSurface | undefined => {
	if (!base) {
		return override;
	}
	if (!override) {
		return base;
	}
	return {
		...base,
		...override,
		border: override.border
			? { ...base.border, ...override.border }
			: base.border,
	};
};
