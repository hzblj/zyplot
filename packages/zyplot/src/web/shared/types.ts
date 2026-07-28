/**
 * The vocabulary every chart in this organism speaks.
 *
 * Two constraints shape it. **Props stay serializable** — no formatter callbacks,
 * no render props — so a Server Component can render a chart without a client
 * boundary of its own; anything that would have been a callback is expressed as
 * data (`ChartNumberFormat`) instead. And **a series carries its own identity**:
 * colour is assigned from `slot` when it is given, never from the position a
 * series happens to occupy after a filter, because a filter that repaints the
 * survivors makes the reader re-learn the chart.
 */

/**
 * Categorical slots the token palette defines. Seven is the ceiling, not a
 * suggestion — an eighth series is folded into an "other" bucket, faceted into
 * small multiples, or encoded by shape as well as hue. Generating an eighth
 * colour produces one no colour-blind reader can separate from an existing slot.
 */
export const CHART_SERIES_LIMIT = 7;

/**
 * The cap for forms where *every* pair of series can end up adjacent — scatter,
 * bubble, small multiples. Slots 1–3 separate cleanly under simulated protanopia
 * and deuteranopia in both modes; slot 4 does not, so those forms stop at three.
 * Bars, lines and stacks only ever place neighbours side by side and get all seven.
 */
export const CHART_ALL_PAIRS_SERIES_LIMIT = 3;

/** One legend entry: a colour swatch and the already-translated series name. */
export type ChartLegendItem = {
	color: string;
	id: string;
	label: string;
};

/** What every chart in this organism accepts on top of its own data props. */
export type ChartBaseProps = {
	/** Mark entrance and data-update animation. */
	animation?: ChartAnimation;
	/** Reference lines, highlighted ranges, points and text anchored to the plot. */
	annotations?: readonly ChartAnnotation[];
	/** Controls the visible axes on cartesian chart forms. */
	axis?: ChartAxes;
	className?: string;
	/**
	 * Held true while the data is in flight. The chart shows its own `Skeleton` —
	 * same height, same shape — and cross-fades into the plot when it flips false,
	 * so the box never resizes and the page never flinches.
	 */
	isLoading?: boolean;
	/**
	 * Plot height in px. The chart never measures its own content, so the caller
	 * reserves the space and nothing on the page moves when the marks land.
	 */
	height?: number;
	/** Hover, crosshair, tooltip, selection, pan and zoom behavior. */
	interaction?: ChartInteraction;
	/**
	 * Replaces the built-in shape-matched loading state. Rendered only while
	 * `isLoading` is true (or before the canvas theme is ready).
	 */
	skeleton?: ReactNode;
	/** Receives normalized pointer and selection data in client components. */
	onInteraction?: (event: ChartInteractionEvent) => void;
	/** Plot-only surface, border, clipping and inset. */
	plot?: ChartPlotStyle;
	/** Stable per-series styling keyed by `ChartSeries.id`. */
	seriesStyles?: Readonly<Record<string, ChartSeriesStyle>>;
	/**
	 * The container the chart sits in — background, padding, corner radius,
	 * border. Merges over whatever `Chart.Provider` set, key by key.
	 */
	surface?: ChartSurface;
	/**
	 * Draws decal patterns over fills — a second encoding on top of hue, for full
	 * colour-vision deficiency, for print, and for `forced-colors`. Off by default
	 * because a patterned fill is louder than a flat one.
	 */
	texture?: boolean;
	/** Detailed horizontal-axis configuration. */
	xAxis?: ChartAxisOptions;
	/** Detailed vertical-axis configuration. */
	yAxis?: ChartAxisOptions;
};

/** What every chart's co-located `Skeleton` accepts. Uniform on purpose. */
export type ChartSkeletonProps = {
	className?: string;
	height?: number;
	/** Series the real chart will show, so the legend row is reserved at the right width. */
	legendCount?: number;
	/** Reserves the horizontal-axis label row. */
	xAxis?: boolean;
	/** Reserves the vertical-axis label column. */
	yAxis?: boolean;
};

/** Visibility of the two axes used by cartesian chart forms. */
export type ChartAxes = {
	x?: boolean;
	y?: boolean;
};

/** Formatting for values in axis labels, tooltips and direct labels. */
export type ChartNumberFormat = {
	/** Fraction digits. Defaults to 0. */
	decimals?: number;
	/** BCP 47 tag for grouping and decimal separators. Defaults to the runtime locale. */
	locale?: string;
	/** Rendered before the number — a currency symbol, typically. */
	prefix?: string;
	/** Rendered after the number — a unit or a percent sign. */
	suffix?: string;
};

/** One series of values aligned to a chart's shared category axis. */
export type ChartSeries = {
	/** Overrides the active theme palette for this series. */
	color?: string;
	/** Stable identity, used as the React key and for hover correlation. */
	id: string;
	/** Already-translated display name. This package never resolves i18n keys. */
	label: string;
	/**
	 * Palette slot, 1-based. Omit and the series takes its index — correct for a
	 * fixed series list, wrong the moment the list is filtered. Pin it when the
	 * caller can hide series.
	 */
	slot?: number;
	/** `null` is a genuine gap and is rendered as one, not as zero. */
	values: (number | null)[];
};

/** A labelled scalar — the shape part-to-whole and ranked forms consume. */
export type ChartDatum = {
	color?: string;
	id: string;
	label: string;
	slot?: number;
	value: number;
};

/** One point in an unordered two-measure space. */
export type ChartScatterPoint = {
	label?: string;
	/** Bubble magnitude. Omitted, every point draws at the same size. */
	size?: number;
	x: number;
	y: number;
};

/** A named cloud of scatter points. */
export type ChartScatterSeries = {
	color?: string;
	id: string;
	label: string;
	points: ChartScatterPoint[];
	slot?: number;
};

/** One cell of a two-dimensional grid, addressed by axis index. */
export type ChartHeatmapCell = {
	columnIndex: number;
	rowIndex: number;
	/** `null` renders as an empty cell rather than as the ramp's low end. */
	value: number | null;
};

/** A before → after pair for one item. */
export type ChartDumbbellRow = {
	after: number;
	before: number;
	id: string;
	label: string;
};

/** The five-number summary of a distribution, plus its outliers. */
export type ChartBoxplotGroup = {
	id: string;
	label: string;
	max: number;
	median: number;
	min: number;
	outliers?: number[];
	q1: number;
	q3: number;
};

/** One node of a hierarchy. Leaves carry a value; parents sum their children. */
export type ChartHierarchyNode = {
	children?: ChartHierarchyNode[];
	color?: string;
	id: string;
	label: string;
	slot?: number;
	value?: number;
};

/** A weighted edge between two nodes of a flow diagram. */
export type ChartFlowLink = {
	source: string;
	target: string;
	value: number;
};

/** A node of a flow diagram, addressed by `id` from `ChartFlowLink`. */
export type ChartFlowNode = {
	color?: string;
	id: string;
	label: string;
	slot?: number;
};

/** One axis of a radar plot — every series is scored against all of them. */
export type ChartRadarAxis = {
	label: string;
	/** Upper bound for this axis. Axes are independently scaled. */
	max: number;
};

/** A dense time series: parallel arrays, because that is what uPlot consumes. */
export type ChartTimePoints = {
	/** Unix seconds, strictly ascending. */
	timestamps: number[];
	/** One entry per series, each the same length as `timestamps`. */
	values: (number | null)[][];
};

import type {
	ChartAnimation,
	ChartAnnotation,
	ChartAxisOptions,
	ChartInteraction,
	ChartInteractionEvent,
	ChartPlotStyle,
	ChartSeriesStyle,
	ChartSurface,
} from "@hzblj/zyplot-core";
import type { ReactNode } from "react";

export type {
	ChartAnimation,
	ChartAnnotation,
	ChartAxisOptions,
	ChartInteraction,
	ChartInteractionEvent,
	ChartPlotStyle,
	ChartSeriesStyle,
	ChartSurface,
} from "@hzblj/zyplot-core";
