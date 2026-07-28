import { escapeChartHtml, formatChartNumber } from "../format";
import { type ChartTokens, emphasisSeriesColor } from "../tokens";
import type {
	ChartAnimation,
	ChartAnnotation,
	ChartAxes,
	ChartAxisOptions,
	ChartInteraction,
	ChartLegendItem,
	ChartNumberFormat,
	ChartPlotStyle,
} from "../types";

/**
 * The parts of an ECharts option every chart here shares — the recessive grid,
 * the axis chrome, and the tooltip.
 *
 * Two conventions are enforced from this file rather than repeated in each chart.
 *
 * **Chrome recedes**: axis lines are the grid token, ticks are off, split lines
 * are hairlines, and no axis ever paints in a series colour.
 *
 * **The tooltip is HTML, not canvas** — but split down the middle. Its *box* is
 * configured with token values through ECharts' own options, because ECharts
 * writes those properties inline and no class can beat them (see
 * `buildChartTooltip`). Its *contents* are markup ECharts never touches, so they
 * carry `Typography`'s own type-scale classes. That inner markup is the one place
 * in the product where those classes appear without the atom around them, and it
 * is why chart text still matches everything else.
 */

/** Height of the axis gutter, in px — enough for one row of 11px labels. */
const AXIS_GUTTER = 26;
const AXIS_GUTTER_BARE = 6;

export type ChartAxisPointerKind = "line" | "none" | "shadow";

export type ChartTooltipRow = {
	/** Series colour. Omitted, the row renders without a swatch. */
	color?: string;
	label: string;
	value: string;
};

export const buildChartTextStyle = (tokens: ChartTokens) => ({
	color: tokens.label,
	fontFamily: tokens.fontFamily,
});

const renderTooltipHeading = (title: string | undefined): string => {
	if (!title) {
		return "";
	}

	return `<span class="text-caption-medium text-content-secondary">${escapeChartHtml(title)}</span>`;
};

const renderTooltipSwatch = (color: string | undefined): string => {
	if (!color) {
		return "";
	}

	return `<span class="size-2 shrink-0 rounded-[2px]" style="background:${color}"></span>`;
};

const renderTooltipRow = (row: ChartTooltipRow): string =>
	[
		'<span class="flex items-center gap-2">',
		renderTooltipSwatch(row.color),
		`<span class="flex-1 text-footnote text-content-secondary">${escapeChartHtml(row.label)}</span>`,
		`<span class="text-footnote-medium text-content-primary tabular-nums">${escapeChartHtml(row.value)}</span>`,
		"</span>",
	].join("");

/**
 * Renders tooltip contents. Kept as a string builder because ECharts owns the
 * tooltip element — React never gets to mount inside it.
 */
export const renderChartTooltip = (
	title: string | undefined,
	rows: ChartTooltipRow[],
): string => {
	const heading = renderTooltipHeading(title);
	const body = rows.map(renderTooltipRow).join("");

	return `<span class="flex min-w-36 flex-col gap-1.5 px-3 py-2">${heading}${body}</span>`;
};

/**
 * The tooltip box.
 *
 * **The box cannot be styled with classes.** `assembleCssText` in ECharts writes
 * `background-color`, `border-*`, `padding`, `font` and `box-shadow` straight
 * onto the element's `style` attribute on every show, and an inline style beats
 * any utility class. Handing it `backgroundColor: 'transparent'` and relying on
 * a `bg-surface-secondary` class gets you a tooltip you can see straight
 * through. So the box takes token *values*, and only the inner markup — which
 * ECharts never touches — carries Tailwind.
 *
 * ECharts' own drop shadow is zeroed: the design system's card is a hairline
 * ring, and the library's default is a hardcoded black blur that belongs to no
 * token.
 */
export const buildChartTooltip = (
	tokens: ChartTokens,
	pointer: ChartAxisPointerKind = "none",
) => ({
	axisPointer: {
		lineStyle: { color: tokens.axis, width: 1 },
		shadowStyle: { color: "transparent" },
		type: pointer,
	},
	backgroundColor: tokens.surface,
	borderColor: tokens.border,
	borderRadius: 10,
	borderWidth: 1,
	padding: 0,
	shadowBlur: 0,
	shadowColor: "transparent",
	shadowOffsetX: 0,
	shadowOffsetY: 0,
	textStyle: buildChartTextStyle(tokens),
	transitionDuration: 0.15,
});

/**
 * The plot rect, sized so axis labels are inside it rather than clipped by it.
 *
 * `containLabel: true` is the ECharts 5 way of saying this and is a silent no-op
 * in 6 — it warns once and then lets the labels run off the canvas. The
 * documented replacement is `outerBoundsMode: 'same'`; `outerBoundsContain: 'all'`
 * reserves room for axis names too, which the legacy flag never did.
 */
export const buildChartGrid = (
	hasCategoryGutter = true,
	plot?: ChartPlotStyle,
) => {
	let bottom = AXIS_GUTTER_BARE;
	if (hasCategoryGutter) {
		bottom = AXIS_GUTTER;
	}

	const padding =
		typeof plot?.padding === "number"
			? {
					bottom: plot.padding,
					left: plot.padding,
					right: plot.padding,
					top: plot.padding,
				}
			: plot?.padding;

	return {
		backgroundColor: plot?.backgroundColor,
		borderColor: plot?.borderColor,
		borderWidth: plot?.borderWidth,
		bottom: bottom + (padding?.bottom ?? 0),
		left: 4 + (padding?.left ?? 0),
		outerBoundsContain: "all" as const,
		outerBoundsMode: "same" as const,
		right: 8 + (padding?.right ?? 0),
		show: Boolean(
			plot?.backgroundColor ||
				plot?.borderColor ||
				(plot?.borderWidth ?? 0) > 0,
		),
		top: 8 + (padding?.top ?? 0),
	};
};

export const buildCategoryAxis = (
	tokens: ChartTokens,
	categories: string[],
	isRotated = false,
	options?: ChartAxisOptions,
) => {
	let rotate = options?.labelRotation ?? 0;
	if (isRotated) {
		rotate = 40;
	}

	return {
		axisLabel: {
			color: tokens.label,
			fontFamily: tokens.fontFamily,
			fontSize: 11,
			hideOverlap: true,
			rotate,
		},
		axisLine: { lineStyle: { color: tokens.grid } },
		axisTick: { show: false },
		data: categories,
		inverse: options?.reversed,
		name: options?.label,
		position:
			options?.position === "end" ? ("top" as const) : ("bottom" as const),
		splitLine: {
			lineStyle: {
				color: tokens.grid,
				type: options?.gridDash?.length ? options.gridDash : undefined,
			},
			show: options?.grid ?? false,
		},
		type: options?.scale === "time" ? ("time" as const) : ("category" as const),
	};
};

export const buildValueAxis = (
	tokens: ChartTokens,
	format?: ChartNumberFormat,
	options?: ChartAxisOptions,
) => ({
	axisLabel: {
		color: tokens.label,
		fontFamily: tokens.fontFamily,
		fontSize: 11,
		formatter: (value: number) => formatChartNumber(value, format),
	},
	axisLine: { show: false },
	axisTick: { show: false },
	inverse: options?.reversed,
	max: options?.domain?.max,
	min: options?.domain?.min,
	name: options?.label,
	position:
		options?.position === "end" ? ("right" as const) : ("left" as const),
	splitLine: {
		lineStyle: {
			color: tokens.grid,
			type: options?.gridDash?.length ? options.gridDash : undefined,
		},
		show: options?.grid ?? true,
	},
	splitNumber: options?.tickCount,
	type: options?.scale === "log" ? ("log" as const) : ("value" as const),
});

/**
 * The category/value axis pair, in the order the orientation puts them.
 *
 * Swapping which axis is which is the *whole* difference between a column chart
 * and a bar chart, so it lives in one place rather than as a cast at each call.
 */
export const buildCartesianAxes = (
	tokens: ChartTokens,
	categories: string[],
	format: ChartNumberFormat | undefined,
	isHorizontal: boolean,
	axes?: ChartAxes,
	xAxis?: ChartAxisOptions,
	yAxis?: ChartAxisOptions,
) => {
	const categoryAxis = {
		...buildCategoryAxis(
			tokens,
			categories,
			false,
			isHorizontal ? yAxis : xAxis,
		),
		show: isHorizontal
			? (yAxis?.visible ?? axes?.y) !== false
			: (xAxis?.visible ?? axes?.x) !== false,
	};
	const valueAxis = {
		...buildValueAxis(tokens, format, isHorizontal ? xAxis : yAxis),
		show: isHorizontal
			? (xAxis?.visible ?? axes?.x) !== false
			: (yAxis?.visible ?? axes?.y) !== false,
	};

	if (isHorizontal) {
		return { xAxis: valueAxis, yAxis: categoryAxis };
	}

	return { xAxis: categoryAxis, yAxis: valueAxis };
};

/**
 * The frame shared by every ECharts chart: motion, text and accessibility.
 *
 * `texture` turns on ECharts' decal patterns — a second, non-colour encoding for
 * readers who cannot separate two hues, for print, and for `forced-colors`. It is
 * opt-in rather than default because a patterned fill is louder than a flat one.
 */
export const buildChartBaseOption = (
	tokens: ChartTokens,
	texture = false,
	animation?: ChartAnimation,
) => ({
	animation: animation?.enabled ?? true,
	animationDelay: animation?.delay ?? 0,
	animationDuration: animation?.duration ?? 320,
	animationDurationUpdate:
		animation?.updates === false ? 0 : (animation?.duration ?? 320),
	animationEasing: chartEasing(animation?.easing),
	aria: { decal: { show: texture }, enabled: texture },
	textStyle: buildChartTextStyle(tokens),
});

const chartEasing = (easing: ChartAnimation["easing"] | undefined) => {
	switch (easing) {
		case "linear":
			return "linear" as const;
		case "ease-in":
			return "cubicIn" as const;
		case "ease-in-out":
			return "cubicInOut" as const;
		case "spring":
			return "elasticOut" as const;
		default:
			return "cubicOut" as const;
	}
};

export const buildChartInteraction = (
	tokens: ChartTokens,
	interaction?: ChartInteraction,
) => {
	let pointer: ChartAxisPointerKind = "line";
	if (interaction?.crosshair === "none" || interaction?.hover === "none") {
		pointer = "none";
	}
	if (interaction?.hover === "axis" && interaction?.crosshair === "none") {
		pointer = "shadow";
	}

	return {
		...buildChartTooltip(tokens, pointer),
		show: interaction?.tooltip ?? true,
		trigger:
			interaction?.hover === "nearest" ? ("item" as const) : ("axis" as const),
	};
};

export const buildChartAnnotationOption = (
	annotations: readonly ChartAnnotation[] | undefined,
) => {
	const values = annotations ?? [];
	const lines = values.filter((item) => item.type === "line");
	const ranges = values.filter((item) => item.type === "range");
	const points = values.filter(
		(item) => item.type === "point" || item.type === "text",
	);

	return {
		markArea: ranges.length
			? {
					data: ranges.map((item) => [
						item.axis === "x"
							? { name: item.label, xAxis: item.start }
							: { name: item.label, yAxis: item.start },
						item.axis === "x" ? { xAxis: item.end } : { yAxis: item.end },
					]),
					itemStyle: {
						color: ranges[0]?.color,
						opacity: ranges[0]?.opacity ?? 0.12,
					},
					silent: true,
				}
			: undefined,
		markLine: lines.length
			? {
					data: lines.map((item) => ({
						lineStyle: {
							color: item.color,
							type: item.dash?.length ? item.dash : undefined,
						},
						name: item.label,
						...(item.axis === "x"
							? { xAxis: item.value }
							: { yAxis: item.value }),
					})),
					silent: true,
					symbol: "none",
				}
			: undefined,
		markPoint: points.length
			? {
					data: points.map((item) => ({
						coord: [item.x, item.y],
						itemStyle: { color: item.color },
						name: item.type === "text" ? item.text : item.label,
						value: item.type === "text" ? item.text : item.label,
					})),
					silent: true,
					symbolSize: 34,
				}
			: undefined,
	};
};

/** Anything colourable by slot — series, slices, hierarchy nodes. */
type ChartLegendSource = {
	id: string;
	label: string;
	slot?: number;
};

export const buildChartLegendItems = (
	tokens: ChartTokens,
	entries: ChartLegendSource[],
	emphasisId?: string,
): ChartLegendItem[] =>
	entries.map((entry, index) => ({
		color: emphasisSeriesColor(tokens, entry, index, emphasisId),
		id: entry.id,
		label: entry.label,
	}));

/** ECharts hands axis-triggered tooltips an array and item-triggered ones a single param. */
const toParamList = (params: any): any[] => {
	if (Array.isArray(params)) {
		return params;
	}

	return [params];
};

export const firstTooltipParam = (params: any): any => toParamList(params)[0];

/**
 * The formatter for an axis-triggered tooltip: the category as the heading, one
 * row per series that has a value at that category.
 */
export const buildAxisTooltipFormatter =
	(format?: ChartNumberFormat) =>
	(params: any): string => {
		const items = toParamList(params);
		const rows: ChartTooltipRow[] = items.map((item) => ({
			color: item.color,
			label: item.seriesName,
			value: formatChartNumber(item.value, format),
		}));

		return renderChartTooltip(items[0]?.axisValueLabel, rows);
	};
