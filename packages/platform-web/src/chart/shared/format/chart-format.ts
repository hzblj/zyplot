import type { ChartNumberFormat } from "../types";

/**
 * Number formatting for axis labels, tooltips and direct labels.
 *
 * It exists because chart props are serializable: a caller cannot pass a
 * formatter function across the server→client boundary, so it passes a
 * `ChartNumberFormat` describing one instead.
 */

/**
 * The locale used when a caller does not name one.
 *
 * It has to be a **constant**, not the runtime default. `new Intl.NumberFormat()`
 * with no locale resolves to the host's locale, and the host is Node during SSR
 * and the browser afterwards — so 1869 serialises as `1 869` into the HTML and
 * re-renders as `1,869` on hydration, and React throws the whole tree away. A
 * chart that wants the viewer's grouping passes `locale` explicitly; because it
 * then arrives as a prop, both renders agree on it.
 */
const DEFAULT_LOCALE = "en-US";

const formatters = new Map<string, Intl.NumberFormat>();

const formatterFor = (
	locale: string | undefined,
	decimals: number,
): Intl.NumberFormat => {
	const key = `${locale ?? DEFAULT_LOCALE}:${decimals}`;
	const cached = formatters.get(key);
	if (cached) {
		return cached;
	}

	const formatter = new Intl.NumberFormat(locale ?? DEFAULT_LOCALE, {
		maximumFractionDigits: decimals,
		minimumFractionDigits: decimals,
	});
	formatters.set(key, formatter);

	return formatter;
};

/** An en dash for a genuine gap — never a zero, which would read as a measurement. */
export const CHART_EMPTY_VALUE = "–";

export const formatChartNumber = (
	value: number | null | undefined,
	format?: ChartNumberFormat,
): string => {
	if (value === null || value === undefined || Number.isNaN(value)) {
		return CHART_EMPTY_VALUE;
	}

	const formatted = formatterFor(format?.locale, format?.decimals ?? 0).format(
		value,
	);

	return `${format?.prefix ?? ""}${formatted}${format?.suffix ?? ""}`;
};

/** Escapes text before it goes into a tooltip's HTML string. */
export const escapeChartHtml = (value: string): string =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
