export type DocsRoute = {
	/** Sitemap priority hint: the guides outrank the reference pages. */
	isGuide: boolean;
	description: string;
	href: string;
	title: string;
};

/**
 * The guide pages, in reading order, with the copy a search result shows.
 *
 * Written out rather than derived from the sections, because a `<title>` and a
 * meta description are not the page's own headline and lede — they are the same
 * promise made to somebody who has not arrived yet, and they have to stand alone
 * in a list of ten blue links. The section content stays the reader's version.
 *
 * Descriptions sit between 110 and 160 characters, which is what a result snippet
 * shows before it truncates.
 */
const guideRoutes: Omit<DocsRoute, "isGuide">[] = [
	{
		description:
			"Native-feeling charts for React and Expo from one API. Twenty-one chart forms that render through ECharts and uPlot on the web, Swift Charts on iOS and Compose on Android.",
		href: "/docs",
		title: "Documentation",
	},
	{
		description:
			"Install @hzblj/zyplot with npm, yarn, pnpm or bun. One package covers web, iOS and Android, ships its own compiled styles, and needs no Tailwind CSS in your app.",
		href: "/docs/installation",
		title: "Installation",
	},
	{
		description:
			"Theme Zyplot charts with CSS custom properties. The colour, surface and palette contract every renderer implements, and how Chart.Provider scopes it.",
		href: "/docs/theming",
		title: "Theming",
	},
	{
		description:
			"The serializable data contracts every Zyplot chart takes — ChartSeries, ChartDatum, axis options, number formatting, annotations and interaction events.",
		href: "/docs/data-types",
		title: "Data types",
	},
	{
		description:
			"Hold isLoading while data is in flight and a Zyplot chart shows a placeholder matched to its own shape and height, then cross-fades in with no layout shift.",
		href: "/docs/loading-states",
		title: "Loading states",
	},
	{
		description:
			"The DOM renderer: ECharts draws eighteen forms, uPlot handles dense series and sparklines, and legends stay real HTML that a screen reader can read.",
		href: "/docs/web",
		title: "Web renderer",
	},
	{
		description:
			"How Zyplot resolves light and dark mode, why canvas colours are read off the document, and the --zyplot-* custom properties that drive both.",
		href: "/docs/dark-mode",
		title: "Light and dark mode",
	},
	{
		description:
			"Chart.Frame gives a chart a titled card with a caption row, and Chart.Legend places series identity yourself for small multiples or a legend that filters.",
		href: "/docs/composition",
		title: "Frame and legend",
	},
	{
		description:
			"Zyplot ships an Expo module that draws with Swift Charts on iOS and a Jetpack Compose Canvas on Android — the same Chart namespace, and no WebView.",
		href: "/docs/native",
		title: "iOS and Android",
	},
	{
		description:
			"Charts drawn with SwiftUI and Swift Charts. Chart.Range and Chart.Rule are iOS-only, and xAxis takes the Swift Charts scrolling options on top of the shared ones.",
		href: "/docs/native/ios",
		title: "iOS renderer",
	},
	{
		description:
			"Charts drawn on a Jetpack Compose Canvas. Chart.Waterfall and Chart.Lollipop are Android-only, and the axes take Compose overflow handling on top of the shared options.",
		href: "/docs/native/android",
		title: "Android renderer",
	},
];

/**
 * The twenty-one chart pages: the id, the name, and what the page is for.
 *
 * Written here rather than read off the chart docs, for two reasons. The chart
 * docs live in a `"use client"` module, and a value imported from one of those
 * into server code arrives as a client reference rather than the array — the
 * sitemap built from it collected nothing. And a result snippet is not the
 * in-page description: this copy names the form, says when to reach for it and
 * carries the words somebody types into a search box.
 *
 * A chart added to the docs and missed here has no route, so its page 404s
 * rather than quietly losing its title — `docsRouteFor` is what the route
 * checks.
 */
const chartRoutes: { description: string; id: string; name: string }[] = [
	{
		description:
			"Plot continuous trends over an ordered category or time axis, with optional smoothing, annotations and a second series to compare against.",
		id: "line",
		name: "Line",
	},
	{
		description:
			"Show a trend and its magnitude together, stacked to read composition over time or plain to emphasise the volume under one series.",
		id: "area",
		name: "Area",
	},
	{
		description:
			"Compare exact values across a small set of categories, vertically or turned horizontal when the labels are too long to fit under an axis.",
		id: "bar",
		name: "Bar",
	},
	{
		description:
			"Compare category totals and the composition inside each one, normalized to 100 percent when the mix matters more than the absolute total.",
		id: "stacked-bar",
		name: "Stacked bar",
	},
	{
		description:
			"A part-to-whole split for two to five slices, with a folded Other tail so a long list cannot turn into a ring of unreadable slivers.",
		id: "pie",
		name: "Pie",
	},
	{
		description:
			"One current value against a fixed range — capacity, progress or utilisation where the maximum means something to the reader.",
		id: "gauge",
		name: "Gauge",
	},
	{
		description:
			"A compact accessible scalar for table rows, settings and summaries. Two elements and no charting engine, so it needs no client boundary.",
		id: "meter",
		name: "Meter",
	},
	{
		description:
			"Bin raw numeric observations to expose the shape of a distribution — its spread, its skew and the outliers at either end.",
		id: "histogram",
		name: "Histogram",
	},
	{
		description:
			"Compare five-number summaries and outliers across groups, with the median, quartile and whisker labels in your own wording.",
		id: "boxplot",
		name: "Boxplot",
	},
	{
		description:
			"Open, high, low and close per session with an optional volume histogram beneath, plus hollow-up candles for price data.",
		id: "candlestick",
		name: "Candlestick",
	},
	{
		description:
			"Positive and negative values around a shared zero — variance, sentiment, gain and loss, or change from a baseline.",
		id: "diverging-bar",
		name: "Diverging bar",
	},
	{
		description:
			"Movement between exactly two measurements per row, when the story is the change between two known states rather than the trend between them.",
		id: "dumbbell",
		name: "Dumbbell",
	},
	{
		description:
			"Ordered attrition through a sequence of stages, for the case where each stage really is a subset of the one before it.",
		id: "funnel",
		name: "Funnel",
	},
	{
		description:
			"Magnitude across two categorical dimensions, to expose the clusters and the patterns a dense matrix of numbers hides.",
		id: "heatmap",
		name: "Heatmap",
	},
	{
		description:
			"Compare multivariate profiles on a shared set of bounded axes, for reading the shape of a profile rather than looking up a value.",
		id: "radar",
		name: "Radar",
	},
	{
		description:
			"Relationships, clusters and outliers between two measures, with an optional third encoded as point size.",
		id: "scatter",
		name: "Scatter",
	},
	{
		description:
			"Weighted flow between named nodes and stages, for when the volume moving between states is the story.",
		id: "sankey",
		name: "Sankey",
	},
	{
		description:
			"Hierarchical part-to-whole relationships in concentric rings, for when both the depth of the hierarchy and the split inside it matter.",
		id: "sunburst",
		name: "Sunburst",
	},
	{
		description:
			"Hierarchical part-to-whole data packed into a rectangle, for when screen efficiency matters more than reading the depth.",
		id: "treemap",
		name: "Treemap",
	},
	{
		description:
			"Tens of thousands of ordered time points, rendered through uPlot for dense telemetry that would drop frames on a scene graph.",
		id: "time-series",
		name: "Time series",
	},
	{
		description:
			"A tiny trend shape with no axes, tooltip or legend, for a table row or a card where the chart is context rather than the subject.",
		id: "sparkline",
		name: "Sparkline",
	},
];

/** Every documentation URL, for the sitemap and for per-page metadata. */
export const DOCS_ROUTES: DocsRoute[] = [
	...guideRoutes.map((route) => ({ ...route, isGuide: true })),
	...chartRoutes.map((chart) => ({
		description: chart.description,
		href: `/docs/charts/${chart.id}`,
		isGuide: false,
		title: `${chart.name} chart`,
	})),
];

/** The metadata for a docs URL, or undefined for one that is not ours. */
export const docsRouteFor = (href: string) =>
	DOCS_ROUTES.find((route) => route.href === href);
