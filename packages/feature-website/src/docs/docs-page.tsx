"use client";

import { Chart } from "@hzblj/zyplot";
import Link from "next/link";
import type { ReactNode } from "react";
import { docsStyles } from "../docs-styles";
import { GithubMark } from "../github-mark";
import { HERO_HEADLINE, HERO_LEDE } from "../hero-copy";
import { MobileNav } from "../mobile-nav";
import { ThemeToggle } from "../theme-toggle";
import { cn } from "../utils";
import { Wordmark } from "../wordmark";
import { ChartSection } from "./components/chart-section";
import { CodeBlock } from "./components/code-block";
import { DocsNav } from "./components/docs-nav";
import { PackageInstall } from "./components/package-install";
import { PlatformBadges } from "./components/platform-badges";
import { PropsTable } from "./components/props-table";
import { DEFAULT_PREFERENCES, type DocsPreferences } from "./preferences";
import type { ChartDoc, PropRow } from "./types";

const styles = docsStyles();

const categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const series = [
	{
		id: "revenue",
		label: "Revenue",
		values: [42, 56, 51, 72, 84, 91],
	},
	{
		id: "costs",
		label: "Costs",
		values: [28, 34, 38, 41, 48, 53],
	},
];

/**
 * The tail every DOM chart shares: container, size, loading, nothing else.
 *
 * The groups below it are deliberately separate. `ChartBaseProps` types
 * annotations, axis options and interaction for all twenty-one forms, but only
 * five of them read those props — documenting one on a chart that ignores it is
 * worse than leaving it out, so each form composes the groups it honours.
 */
const classNameProp: PropRow = {
	description: "CSS class applied to the chart root.",
	name: "className",
	type: "string",
};

const heightProp: PropRow = {
	defaultValue: "240",
	description:
		"Plot height in px. A chart never measures its own content, so this is what reserves the space.",
	name: "height",
	type: "number",
};

const isLoadingProp: PropRow = {
	defaultValue: "false",
	description:
		"Held true while the data is in flight. Shows the matching skeleton, then cross-fades into the plot.",
	name: "isLoading",
	type: "boolean",
};

const skeletonProp: PropRow = {
	description:
		"Replaces the built-in placeholder while isLoading is true. Takes a rendered element.",
	name: "skeleton",
	type: "ReactNode",
};

const surfaceProp: PropRow = {
	description:
		"The container the plot sits in — background, border, corner radius, padding. Merges over Chart.Provider, key by key.",
	name: "surface",
	type: "ChartSurface",
};

const baseProps: PropRow[] = [
	classNameProp,
	heightProp,
	isLoadingProp,
	skeletonProp,
	surfaceProp,
];

/** Axis visibility, on the forms that have axes at all. */
const axisProp: PropRow = {
	defaultValue: "{ x: true, y: true }",
	description: "Horizontal and vertical axis visibility.",
	name: "axis",
	type: "ChartAxes",
};

/** Decals. Every ECharts form draws them; uPlot and the DOM meter do not. */
const textureProp: PropRow = {
	defaultValue: "false",
	description:
		"Draws decal patterns over fills — a second encoding on top of hue, for full colour-vision deficiency, print and forced-colors.",
	name: "texture",
	type: "boolean",
};

const seriesStylesProp: PropRow = {
	description:
		"Per-series stroke, fill, dash and symbol, keyed by ChartSeries.id.",
	name: "seriesStyles",
	type: "Record<string, ChartSeriesStyle>",
};

/**
 * What line, area, bar, stacked bar and candlestick wire beyond the basics —
 * the forms whose readers annotate, rescale and zoom.
 */
const plotProps: PropRow[] = [
	{
		description: "Mark entrance and data-update animation.",
		name: "animation",
		type: "ChartAnimation",
	},
	{
		description:
			"Reference lines, highlighted ranges, points and text anchored to the plot.",
		name: "annotations",
		type: "ChartAnnotation[]",
	},
	{
		description:
			"Hover, crosshair, tooltip, selection, pan and zoom behaviour.",
		name: "interaction",
		type: "ChartInteraction",
	},
	{
		description:
			"Receives normalized pointer and selection data. Needs a client component.",
		name: "onInteraction",
		type: "(event: ChartInteractionEvent) => void",
	},
	{
		description:
			"The plot area alone — its own background, border, clipping and padding, inside the surface.",
		name: "plot",
		type: "ChartPlotStyle",
	},
	{
		description:
			"Scale, domain, ticks, grid and label for the horizontal axis — everything axis cannot say.",
		name: "xAxis",
		type: "ChartAxisOptions",
	},
	{
		description: "The same for the vertical axis.",
		name: "yAxis",
		type: "ChartAxisOptions",
	},
];

const formatProp: PropRow = {
	description: "Number formatting shared by axes, labels and tooltips.",
	name: "format",
	type: "ChartNumberFormat",
};

const seriesProp: PropRow = {
	description: "Named data series aligned with the category axis.",
	name: "series",
	required: true,
	type: "ChartSeries[]",
};

const categoriesProp: PropRow = {
	description: "Labels for the shared category axis.",
	name: "categories",
	required: true,
	type: "string[]",
};

const emphasisProp: PropRow = {
	description: "Keeps one series colored and mutes the others.",
	name: "emphasisId",
	type: "string",
};

/** An ECharts form with no plot controls: decals and the shared tail. */
const withBase = (...props: PropRow[]) => [...props, textureProp, ...baseProps];

/** One of the five plot-controlled cartesian forms. */
const withPlotControls = (...props: PropRow[]) => [
	...props,
	axisProp,
	...plotProps,
	textureProp,
	...baseProps,
];

/**
 * Every form documented on this page renders on all three platforms. The
 * platform-only ones — `Chart.Range` and `Chart.Rule` on iOS, `Chart.Lollipop`
 * and `Chart.Waterfall` on Android — live in the platform guides instead,
 * because they are reached through a different import.
 */
const everywhere = ["web", "ios", "android"] as const;

const code = (name: string, body: string) =>
	`import { Chart } from '@hzblj/zyplot'

export function Example() {
  return (
    <Chart.${name}
${body}
    />
  )
}`;

const heatCells = Array.from({ length: 24 }, (_, index) => ({
	columnIndex: index % 6,
	rowIndex: Math.floor(index / 6),
	value: 18 + ((index * 17) % 76),
}));

const hierarchy = [
	{
		children: [
			{ id: "web", label: "Web", value: 48 },
			{ id: "ios", label: "iOS", value: 31 },
			{ id: "android", label: "Android", value: 21 },
		],
		id: "product",
		label: "Product",
	},
	{
		children: [
			{ id: "search", label: "Search", value: 28 },
			{ id: "social", label: "Social", value: 18 },
		],
		id: "growth",
		label: "Growth",
	},
];

const timePoints = {
	timestamps: Array.from(
		{ length: 36 },
		(_, index) => 1_735_689_600 + index * 86_400,
	),
	values: [
		Array.from(
			{ length: 36 },
			(_, index) => 42 + index * 1.4 + Math.sin(index / 2) * 8,
		),
		Array.from(
			{ length: 36 },
			(_, index) => 31 + index * 0.8 + Math.cos(index / 3) * 6,
		),
	],
};

/** Five sessions of a synthetic instrument — enough to show a gap and a reversal. */
const candles = [
	{
		category: "Mon",
		close: 132,
		high: 136,
		id: "mon",
		low: 124,
		open: 126,
		volume: 18_400,
	},
	{
		category: "Tue",
		close: 128,
		high: 138,
		id: "tue",
		low: 127,
		open: 133,
		volume: 22_100,
	},
	{
		category: "Wed",
		close: 141,
		high: 144,
		id: "wed",
		low: 128,
		open: 129,
		volume: 31_700,
	},
	{
		category: "Thu",
		close: 139,
		high: 147,
		id: "thu",
		low: 137,
		open: 142,
		volume: 25_300,
	},
	{
		category: "Fri",
		close: 152,
		high: 154,
		id: "fri",
		low: 138,
		open: 140,
		volume: 40_900,
	},
];

const chartDocs: ChartDoc[] = [
	{
		code: code(
			"Line",
			`      categories={['Jan', 'Feb', 'Mar', 'Apr']}
      series={series}
      format={{ prefix: '$' }}`,
		),
		description:
			"Compare continuous trends across an ordered category or time axis.",
		id: "line",
		name: "Line",
		platforms: everywhere,
		preview: (
			<Chart.Line
				categories={categories}
				format={{ prefix: "$" }}
				height={300}
				series={series}
			/>
		),
		props: withPlotControls(
			categoriesProp,
			seriesProp,
			formatProp,
			emphasisProp,
			{
				defaultValue: "false",
				description: "Draws rounded interpolation between observations.",
				name: "isSmooth",
				type: "boolean",
			},
			seriesStylesProp,
		),
		when: "Use for trends. Do not smooth data when intermediate values are unknown.",
	},
	{
		code: code(
			"Area",
			`      categories={categories}
      series={series}
      isStacked`,
		),
		description:
			"Show a trend while emphasizing magnitude or composition over time.",
		id: "area",
		name: "Area",
		platforms: everywhere,
		preview: (
			<Chart.Area
				categories={categories}
				height={300}
				isStacked
				series={series}
			/>
		),
		props: withPlotControls(
			categoriesProp,
			seriesProp,
			formatProp,
			emphasisProp,
			{
				defaultValue: "false",
				description: "Rounds the line interpolation.",
				name: "isSmooth",
				type: "boolean",
			},
			{
				defaultValue: "false",
				description: "Stacks series to show their combined composition.",
				name: "isStacked",
				type: "boolean",
			},
			seriesStylesProp,
		),
		when: "Use when magnitude matters in addition to direction.",
	},
	{
		code: code(
			"Bar",
			`      categories={categories}
      series={series}
      orientation="vertical"`,
		),
		description: "Compare discrete values across a small set of categories.",
		id: "bar",
		name: "Bar",
		platforms: everywhere,
		preview: <Chart.Bar categories={categories} height={300} series={series} />,
		props: withPlotControls(
			categoriesProp,
			seriesProp,
			formatProp,
			emphasisProp,
			{
				defaultValue: '"vertical"',
				description: "Direction in which bars grow.",
				name: "orientation",
				type: '"horizontal" | "vertical"',
			},
			seriesStylesProp,
		),
		when: "Use for exact category comparison; switch to horizontal for long labels.",
	},
	{
		code: code(
			"StackedBar",
			`      categories={categories}
      series={series}
      isNormalized`,
		),
		description:
			"Compare category totals and the composition inside each total.",
		id: "stacked-bar",
		name: "Stacked bar",
		platforms: everywhere,
		preview: (
			<Chart.StackedBar
				categories={categories}
				height={300}
				isNormalized
				series={series}
			/>
		),
		props: withPlotControls(
			categoriesProp,
			seriesProp,
			formatProp,
			emphasisProp,
			{
				defaultValue: "false",
				description: "Normalizes every stack to 100 percent.",
				name: "isNormalized",
				type: "boolean",
			},
			{
				defaultValue: '"vertical"',
				description: "Direction in which stacks grow.",
				name: "orientation",
				type: '"horizontal" | "vertical"',
			},
			seriesStylesProp,
		),
		when: "Normalize when composition matters more than absolute total.",
	},
	{
		code: code(
			"Pie",
			`      data={data}
      otherLabel="Other"
      maxSlices={4}`,
		),
		description: "Show a simple part-to-whole relationship with a short tail.",
		id: "pie",
		name: "Pie",
		platforms: everywhere,
		preview: (
			<Chart.Pie
				data={[
					{ id: "direct", label: "Direct", value: 46 },
					{ id: "search", label: "Search", value: 31 },
					{ id: "social", label: "Social", value: 15 },
					{ id: "other", label: "Other", value: 8 },
				]}
				height={300}
			/>
		),
		props: withBase(
			{
				description: "Part-to-whole values ordered by importance.",
				name: "data",
				required: true,
				type: "ChartDatum[]",
			},
			formatProp,
			{
				defaultValue: "false",
				description: "Fills the center to render a full pie.",
				name: "isSolid",
				type: "boolean",
			},
			{
				defaultValue: "3",
				description: "Number of slices retained before folding the tail.",
				name: "maxSlices",
				type: "number",
			},
			{
				description: "Translated label used for the folded tail.",
				name: "otherLabel",
				type: "string",
			},
		),
		when: "Use for two to five parts. Prefer bars when precise comparison matters.",
	},
	{
		code: code("Gauge", `      value={72}\n      max={100}`),
		description: "Show one current value against a fixed bounded range.",
		id: "gauge",
		name: "Gauge",
		platforms: everywhere,
		preview: <Chart.Gauge height={240} max={100} value={72} />,
		props: withBase(
			{
				description: "Current measured value.",
				name: "value",
				required: true,
				type: "number",
			},
			{
				description: "Upper bound of the range.",
				name: "max",
				required: true,
				type: "number",
			},
			{
				defaultValue: "0",
				description: "Lower bound of the range.",
				name: "min",
				type: "number",
			},
			formatProp,
		),
		when: "Use for capacity and progress with a meaningful maximum.",
	},
	{
		code: code(
			"Meter",
			`      label="Storage used"
      value={72}
      max={100}`,
		),
		description:
			"A compact accessible scalar for rows, settings and summaries.",
		id: "meter",
		name: "Meter",
		platforms: everywhere,
		preview: <Chart.Meter label="Storage used" max={100} value={72} />,
		props: [
			{
				description: "Accessible label rendered above the meter.",
				name: "label",
				required: true,
				type: "string",
			},
			{
				description: "Current measured value.",
				name: "value",
				required: true,
				type: "number",
			},
			{
				description: "Upper bound of the meter.",
				name: "max",
				required: true,
				type: "number",
			},
			formatProp,
			{
				defaultValue: "true",
				description: "Displays the numeric value next to the label.",
				name: "showValue",
				type: "boolean",
			},
			classNameProp,
			surfaceProp,
		],
		when: "Use instead of a gauge when vertical space is limited.",
	},
	{
		code: code("Histogram", `      values={observations}\n      binCount={8}`),
		description: "Reveal the distribution of raw numeric observations.",
		id: "histogram",
		name: "Histogram",
		platforms: everywhere,
		preview: (
			<Chart.Histogram
				binCount={8}
				height={300}
				values={[
					12, 18, 21, 21, 24, 27, 29, 31, 31, 32, 34, 35, 35, 36, 39, 42, 44,
					47, 51, 57, 62, 69,
				]}
			/>
		),
		props: withBase(
			{
				description: "Raw observations; binning is handled by the component.",
				name: "values",
				required: true,
				type: "number[]",
			},
			{
				defaultValue: "10",
				description: "Number of equal-width bins.",
				name: "binCount",
				type: "number",
			},
			{
				description: "Formatting used for bin boundaries.",
				name: "valueFormat",
				type: "ChartNumberFormat",
			},
			axisProp,
		),
		when: "Use when shape, spread and outliers matter more than individual values.",
	},
	{
		code: code("Boxplot", `      groups={groups}\n      labels={labels}`),
		description: "Compare five-number summaries and outliers across groups.",
		id: "boxplot",
		name: "Boxplot",
		platforms: everywhere,
		preview: (
			<Chart.Boxplot
				groups={[
					{
						id: "a",
						label: "Starter",
						max: 91,
						median: 54,
						min: 12,
						outliers: [98],
						q1: 34,
						q3: 72,
					},
					{
						id: "b",
						label: "Pro",
						max: 84,
						median: 61,
						min: 24,
						outliers: [],
						q1: 45,
						q3: 74,
					},
				]}
				height={300}
				labels={{
					max: "Max",
					median: "Median",
					min: "Min",
					q1: "Q1",
					q3: "Q3",
				}}
			/>
		),
		props: withBase(
			{
				description: "Five-number summaries and optional outliers.",
				name: "groups",
				required: true,
				type: "ChartBoxplotGroup[]",
			},
			{
				description: "Translated labels for summary statistics.",
				name: "labels",
				required: true,
				type: "BoxplotLabels",
			},
			formatProp,
			{
				defaultValue: '"vertical"',
				description: "Direction of the value axis.",
				name: "orientation",
				type: '"horizontal" | "vertical"',
			},
			axisProp,
		),
		when: "Use to compare distributions when raw observations are not required.",
	},
	{
		code: code(
			"Candlestick",
			`      data={candles}
      format={{ prefix: '$' }}
      showVolume`,
		),
		description:
			"Show open, high, low and close for each session, with optional volume.",
		id: "candlestick",
		name: "Candlestick",
		platforms: everywhere,
		preview: (
			<Chart.Candlestick
				data={candles}
				format={{ prefix: "$" }}
				height={320}
				showVolume
			/>
		),
		props: withPlotControls(
			{
				description: "One entry per session, in chronological order.",
				name: "data",
				required: true,
				type: "ChartCandlestickDatum[]",
			},
			formatProp,
			{
				defaultValue: "false",
				description:
					"Adds a volume histogram beneath the price plot. Needs `volume` on each datum.",
				name: "showVolume",
				type: "boolean",
			},
			{
				description:
					"Candle body, wick and volume colors, plus hollow-up rendering.",
				name: "style",
				type: "ChartCandlestickStyle",
			},
		),
		when: "Use for OHLC price data. For a single measure over time reach for Line or Time series instead — a candlestick spends four values of ink on one.",
	},
	{
		code: code(
			"DivergingBar",
			`      data={changes}\n      format={{ suffix: '%' }}`,
		),
		description: "Compare positive and negative values around a shared zero.",
		id: "diverging-bar",
		name: "Diverging bar",
		platforms: everywhere,
		preview: (
			<Chart.DivergingBar
				data={[
					{ id: "north", label: "North", value: 18 },
					{ id: "south", label: "South", value: -12 },
					{ id: "east", label: "East", value: 9 },
					{ id: "west", label: "West", value: -7 },
				]}
				format={{ suffix: "%" }}
				height={300}
			/>
		),
		props: withBase(
			{
				description: "Signed values positioned around zero.",
				name: "data",
				required: true,
				type: "ChartDatum[]",
			},
			formatProp,
			{
				defaultValue: '"horizontal"',
				description: "Direction in which values diverge.",
				name: "orientation",
				type: '"horizontal" | "vertical"',
			},
			axisProp,
		),
		when: "Use for variance, sentiment, gain/loss and change from baseline.",
	},
	{
		code: code(
			"Dumbbell",
			`      rows={rows}
      beforeLabel="2025"
      afterLabel="2026"`,
		),
		description: "Show movement between exactly two measurements per item.",
		id: "dumbbell",
		name: "Dumbbell",
		platforms: everywhere,
		preview: (
			<Chart.Dumbbell
				afterLabel="2026"
				beforeLabel="2025"
				height={300}
				rows={[
					{ after: 72, before: 54, id: "activation", label: "Activation" },
					{ after: 61, before: 68, id: "retention", label: "Retention" },
					{ after: 84, before: 63, id: "quality", label: "Quality" },
				]}
			/>
		),
		props: withBase(
			{
				description: "Paired before and after values.",
				name: "rows",
				required: true,
				type: "ChartDumbbellRow[]",
			},
			{
				description: "Translated label for the first measurement.",
				name: "beforeLabel",
				required: true,
				type: "string",
			},
			{
				description: "Translated label for the second measurement.",
				name: "afterLabel",
				required: true,
				type: "string",
			},
			formatProp,
			axisProp,
		),
		when: "Use when the story is change between two known states.",
	},
	{
		code: code(
			"Funnel",
			`      stages={stages}\n      format={{ suffix: ' users' }}`,
		),
		description: "Show ordered attrition through a sequence of stages.",
		id: "funnel",
		name: "Funnel",
		platforms: everywhere,
		preview: (
			<Chart.Funnel
				height={300}
				stages={[
					{ id: "visit", label: "Visited", value: 1200 },
					{ id: "trial", label: "Started trial", value: 740 },
					{ id: "active", label: "Activated", value: 460 },
					{ id: "paid", label: "Paid", value: 210 },
				]}
			/>
		),
		props: withBase(
			{
				description: "Stages ordered from widest to narrowest.",
				name: "stages",
				required: true,
				type: "ChartDatum[]",
			},
			formatProp,
		),
		when: "Use only when each stage is a subset of the previous stage.",
	},
	{
		code: code(
			"Heatmap",
			`      columns={days}
      rows={hours}
      cells={cells}`,
		),
		description: "Display magnitude across two categorical dimensions.",
		id: "heatmap",
		name: "Heatmap",
		platforms: everywhere,
		preview: (
			<Chart.Heatmap
				cells={heatCells}
				columns={categories}
				height={300}
				rows={["Morning", "Noon", "Evening", "Night"]}
			/>
		),
		props: withBase(
			{
				description: "Grid cells addressed by row and column index.",
				name: "cells",
				required: true,
				type: "ChartHeatmapCell[]",
			},
			{
				description: "Column axis labels.",
				name: "columns",
				required: true,
				type: "string[]",
			},
			{
				description: "Row axis labels.",
				name: "rows",
				required: true,
				type: "string[]",
			},
			formatProp,
			axisProp,
		),
		when: "Use to expose clusters and patterns in a dense matrix.",
	},
	{
		code: code("Radar", `      axes={axes}\n      series={series}`),
		description:
			"Compare multivariate profiles on a shared set of bounded axes.",
		id: "radar",
		name: "Radar",
		platforms: everywhere,
		preview: (
			<Chart.Radar
				axes={[
					{ label: "Speed", max: 100 },
					{ label: "Quality", max: 100 },
					{ label: "Reach", max: 100 },
					{ label: "Value", max: 100 },
					{ label: "Ease", max: 100 },
				]}
				height={320}
				series={[
					{ id: "starter", label: "Starter", values: [72, 61, 88, 79, 92] },
					{ id: "pro", label: "Pro", values: [91, 84, 74, 88, 68] },
				]}
			/>
		),
		props: withBase(
			{
				description: "Labels and upper bounds for each dimension.",
				name: "axes",
				required: true,
				type: "ChartRadarAxis[]",
			},
			seriesProp,
			formatProp,
		),
		when: "Use for profile shape, not precise lookup; keep dimensions limited.",
	},
	{
		code: code(
			"Scatter",
			`      series={series}
      xLabel="Spend"
      yLabel="Revenue"`,
		),
		description:
			"Reveal relationships, clusters and outliers between two measures.",
		id: "scatter",
		name: "Scatter",
		platforms: everywhere,
		preview: (
			<Chart.Scatter
				height={300}
				series={[
					{
						id: "accounts",
						label: "Accounts",
						points: [
							{ label: "A", size: 24, x: 12, y: 42 },
							{ label: "B", size: 48, x: 24, y: 61 },
							{ label: "C", size: 32, x: 38, y: 68 },
							{ label: "D", size: 62, x: 54, y: 89 },
							{ label: "E", size: 28, x: 68, y: 78 },
						],
					},
				]}
				xLabel="Spend"
				yLabel="Revenue"
			/>
		),
		props: withBase(
			{
				description: "Named groups of points in a two-measure space.",
				name: "series",
				required: true,
				type: "ChartScatterSeries[]",
			},
			{
				description: "Label shown for the horizontal measure.",
				name: "xLabel",
				type: "string",
			},
			{
				description: "Number formatting for horizontal values.",
				name: "xFormat",
				type: "ChartNumberFormat",
			},
			{
				description: "Label shown for the vertical measure.",
				name: "yLabel",
				type: "string",
			},
			{
				description: "Number formatting for vertical values.",
				name: "yFormat",
				type: "ChartNumberFormat",
			},
			axisProp,
		),
		when: "Use for correlation and distribution across two numeric dimensions.",
	},
	{
		code: code("Sankey", `      nodes={nodes}\n      links={links}`),
		description: "Trace weighted flow between named nodes and stages.",
		id: "sankey",
		name: "Sankey",
		platforms: everywhere,
		preview: (
			<Chart.Sankey
				height={320}
				links={[
					{ source: "visits", target: "trial", value: 72 },
					{ source: "visits", target: "exit", value: 28 },
					{ source: "trial", target: "paid", value: 44 },
					{ source: "trial", target: "churn", value: 28 },
				]}
				nodes={[
					{ id: "visits", label: "Visits" },
					{ id: "trial", label: "Trial" },
					{ id: "exit", label: "Exit" },
					{ id: "paid", label: "Paid" },
					{ id: "churn", label: "Churn" },
				]}
			/>
		),
		props: withBase(
			{
				description: "Named nodes referenced by links.",
				name: "nodes",
				required: true,
				type: "ChartFlowNode[]",
			},
			{
				description: "Weighted source-to-target relationships.",
				name: "links",
				required: true,
				type: "ChartFlowLink[]",
			},
			formatProp,
		),
		when: "Use when flow volume between states is the primary story.",
	},
	{
		code: code("Sunburst", `      nodes={hierarchy}`),
		description:
			"Show hierarchical part-to-whole relationships in concentric rings.",
		id: "sunburst",
		name: "Sunburst",
		platforms: everywhere,
		preview: <Chart.Sunburst height={320} nodes={hierarchy} />,
		props: withBase(
			{
				description: "Nested hierarchy; leaf nodes carry values.",
				name: "nodes",
				required: true,
				type: "ChartHierarchyNode[]",
			},
			formatProp,
		),
		when: "Use when both hierarchy depth and part-to-whole structure matter.",
	},
	{
		code: code("Treemap", `      nodes={hierarchy}`),
		description:
			"Fit hierarchical part-to-whole data into a compact rectangle.",
		id: "treemap",
		name: "Treemap",
		platforms: everywhere,
		preview: <Chart.Treemap height={320} nodes={hierarchy} />,
		props: withBase(
			{
				description: "Nested hierarchy; leaf nodes carry values.",
				name: "nodes",
				required: true,
				type: "ChartHierarchyNode[]",
			},
			formatProp,
		),
		when: "Use when screen efficiency matters more than reading hierarchy depth.",
	},
	{
		code: code(
			"TimeSeries",
			`      points={points}
      series={series}
      height={320}`,
		),
		description: "Render tens of thousands of ordered time points efficiently.",
		id: "time-series",
		name: "Time series",
		platforms: everywhere,
		preview: (
			<Chart.TimeSeries
				height={300}
				points={timePoints}
				series={[
					{ id: "requests", label: "Requests" },
					{ id: "errors", label: "Errors" },
				]}
			/>
		),
		/**
		 * uPlot, so no decals and none of the plot controls the ECharts cartesian
		 * forms carry — the crosshair and the axis chrome are the engine's own.
		 */
		props: [
			{
				description:
					"Parallel timestamp and value arrays optimized for density.",
				name: "points",
				required: true,
				type: "ChartTimePoints",
			},
			{
				description:
					"Series identity and colour only — the values live in points.",
				name: "series",
				required: true,
				type: 'Omit<ChartSeries, "values">[]',
			},
			formatProp,
			axisProp,
			...baseProps,
		],
		when: "Use for dense telemetry. Prefer Line for small human-scale datasets.",
	},
	{
		code: code(
			"Sparkline",
			`      values={[12, 18, 14, 24, 31, 29]}\n      slot={1}`,
		),
		description: "A tiny trend shape without axes, tooltip or legend.",
		id: "sparkline",
		name: "Sparkline",
		platforms: everywhere,
		preview: (
			<div className={styles.compactPreview()}>
				<Chart.Sparkline
					height={72}
					slot={1}
					values={[12, 18, 14, 24, 31, 29, 38]}
				/>
			</div>
		),
		props: [
			{
				description: "Ordered values used to draw the trend.",
				name: "values",
				required: true,
				type: "number[]",
			},
			{
				description: "Palette slot used for the stroke.",
				name: "slot",
				type: "number",
			},
			{
				description: "Explicit stroke color overriding the palette.",
				name: "color",
				type: "string",
			},
			classNameProp,
			{ ...heightProp, defaultValue: "32" },
			isLoadingProp,
			surfaceProp,
		],
		when: "Use inside a table row or card as context, never for exact lookup.",
	},
];

/**
 * Reading order, and what the pager walks.
 *
 * The shared vocabulary comes before either platform: theming, the data
 * contracts and loading behave the same everywhere, while the pages under Web
 * and Native are the parts that only exist on one renderer.
 */
const guidePages = [
	"introduction",
	"installation",
	"theming",
	"data-types",
	"loading-states",
	"web-package",
	"dark-mode",
	"composition",
	"native-package",
	"native-ios",
	"native-android",
	...chartDocs.map((chart) => chart.id),
];

const guidePageHeadings: Record<string, { id: string; label: string }[]> = {
	"dark-mode": [
		{ id: "dark-mode", label: "Light and dark mode" },
		{ id: "color-modes", label: "Resolution" },
		{ id: "css-variables", label: "The CSS contract" },
	],
	"data-types": [
		{ id: "data-types", label: "Data types" },
		{ id: "chart-series", label: "ChartSeries" },
		{ id: "chart-datum", label: "ChartDatum" },
		{ id: "chart-options", label: "Axes and number formatting" },
		{ id: "chart-legend", label: "ChartLegendItem" },
		{ id: "specialized-data", label: "Specialized data" },
		{ id: "finance-data", label: "Candlestick data" },
		{ id: "axis-options", label: "Axis options" },
		{ id: "annotations", label: "Annotations" },
		{ id: "interaction", label: "Interaction" },
		{ id: "plot-style", label: "Plot and series style" },
	],
	installation: [
		{ id: "installation", label: "Installation" },
		{ id: "entry-points", label: "Entry points" },
	],
	introduction: [{ id: "getting-started", label: "Getting started" }],
	"loading-states": [
		{ id: "loading-states", label: "Loading states" },
		{ id: "skeleton-props", label: "Skeleton props" },
		{ id: "custom-skeleton", label: "Custom skeleton" },
	],
	composition: [
		{ id: "composition", label: "Frame and legend" },
		{ id: "frame-props", label: "Frame props" },
		{ id: "legend-props", label: "Legend props" },
	],
	theming: [
		{ id: "theming", label: "Theming" },
		{ id: "theme-keys", label: "The theme contract" },
		{ id: "surface", label: "The chart surface" },
		{ id: "provider-props", label: "Provider props" },
	],
	"web-package": [
		{ id: "web-package", label: "The web renderer" },
		{ id: "web-engines", label: "What draws what" },
		{ id: "web-legend", label: "Text stays in the DOM" },
		{ id: "web-server-components", label: "Server components" },
	],
	"native-package": [
		{ id: "native-package", label: "Native overview" },
		{ id: "native-install", label: "Installation" },
		{ id: "native-platform-files", label: "Platform-specific files" },
		{ id: "native-coverage", label: "Chart coverage" },
		{ id: "native-differences", label: "Differences from web" },
	],
	"native-ios": [
		{ id: "native-ios", label: "iOS" },
		{ id: "native-ios-extensions", label: "iOS-only charts" },
		{ id: "native-ios-axis", label: "iOS axis options" },
	],
	"native-android": [
		{ id: "native-android", label: "Android" },
		{ id: "native-android-extensions", label: "Android-only charts" },
		{ id: "native-android-axis", label: "Android axis options" },
	],
};

const githubLink = (
	<a
		className={styles.sidebarFooterLink()}
		href="https://github.com/hzblj/zyplot"
	>
		<GithubMark className={styles.sidebarFooterMark()} />
		GitHub
	</a>
);

export const DocsLayout = ({ children }: { children: ReactNode }) => (
	<div className={styles.site()}>
		{/*
		 * Below 820px the sidebar is gone and this header carries the nav instead:
		 * the drawer's hamburger, and the theme toggle the fixed corner one hands
		 * over to — that one is positioned over exactly this row.
		 */}
		<header className={styles.mobileHeader()}>
			<div className={styles.mobileHeaderBrand()}>
				<Link className={styles.brandLink()} href="/">
					<Wordmark className={styles.wordmark()} />
				</Link>
				<span>Docs</span>
			</div>
			<div className={styles.mobileHeaderActions()}>
				<ThemeToggle />
				<MobileNav>
					<DocsNav charts={chartDocs} label="Documentation menu" />
					<div className={styles.sidebarFooter()}>{githubLink}</div>
				</MobileNav>
			</div>
		</header>
		<div className={styles.themeCorner()}>
			<ThemeToggle />
		</div>

		<aside className={styles.sidebar()}>
			<div className={styles.sidebarTop()}>
				<Link className={styles.brandLink()} href="/">
					<Wordmark className={styles.wordmark()} />
				</Link>
				<span>Docs</span>
			</div>
			<DocsNav charts={chartDocs} label="Documentation" />
			<div className={styles.sidebarFooter()}>{githubLink}</div>
		</aside>
		{children}
	</div>
);

export const DocsPage = ({
	page = "introduction",
	preferences = DEFAULT_PREFERENCES,
}: {
	page?: string;
	/** Resolved from the request cookies by the route, not read on the client. */
	preferences?: DocsPreferences;
}) => {
	const pageIndex = Math.max(0, guidePages.indexOf(page));
	const previousPage = guidePages[pageIndex - 1];
	const nextPage = guidePages[pageIndex + 1];
	const currentChart = chartDocs.find((chart) => chart.id === page);
	const pageHeadings = currentChart
		? [
				{ id: currentChart.id, label: currentChart.name },
				{ id: `${currentChart.id}-props`, label: "Props" },
			]
		: (guidePageHeadings[page] ?? guidePageHeadings.introduction);

	return (
		<>
			<main className={styles.content()}>
				<section
					className={cn(styles.hero(), page !== "introduction" && "hidden")}
					id="getting-started"
				>
					<p className={styles.kicker()}>Getting started</p>
					<h1>{HERO_HEADLINE}</h1>
					<p>{HERO_LEDE}</p>
				</section>

				<section
					className={cn(styles.section(), page !== "installation" && "hidden")}
					id="installation"
				>
					<h2>Installation</h2>
					<p>
						One package covers every platform. There is nothing else to add for
						iOS or Android — the native modules ship inside it.
					</p>
					<PackageInstall />
					<div className={styles.note()}>
						<strong>No stylesheet import.</strong> Zyplot includes its compiled
						styles through the JavaScript entry point. Your application does not
						need Tailwind CSS.
					</div>
					<h3 id="entry-points">Entry points</h3>
					<p>
						A plain <code>@hzblj/zyplot</code> import resolves to the renderer
						the current target needs, and gives you the chart forms that exist
						everywhere. The three subpaths name a platform outright, and are how
						you reach forms only one renderer has.
					</p>
					<PropsTable
						rows={[
							{
								description:
									"Resolves per target: ECharts and uPlot on the web, the native module under React Native. Exposes the twenty-one shared forms.",
								name: "@hzblj/zyplot",
								type: "any target",
							},
							{
								description:
									"The DOM renderer, and the only entry with Chart.Frame, Chart.Legend and a .Skeleton on every form.",
								name: "@hzblj/zyplot/web",
								type: "web",
							},
							{
								description:
									"Shared forms plus Chart.Range and Chart.Rule, widened with the Swift Charts axis options.",
								name: "@hzblj/zyplot/ios",
								type: "iOS",
							},
							{
								description:
									"Shared forms plus Chart.Lollipop and Chart.Waterfall, widened with the Compose axis options.",
								name: "@hzblj/zyplot/android",
								type: "Android",
							},
						]}
					/>
				</section>

				<section
					className={cn(styles.section(), page !== "web-package" && "hidden")}
					id="web-package"
				>
					<p className={styles.kicker()}>Web</p>
					<h2>The web renderer</h2>
					<p>
						<code>@hzblj/zyplot/web</code> draws in the DOM. A plain{" "}
						<code>@hzblj/zyplot</code> import already resolves here on every
						target except React Native, so naming the subpath only matters in a
						project that has both. It is also the only entry point that carries{" "}
						<code>Chart.Frame</code>, <code>Chart.Legend</code> and a{" "}
						<code>.Skeleton</code> on every form — all three are DOM composition
						with no native counterpart. <code>Chart.Provider</code> exists on
						every entry point, but only here does it take <code>colorMode</code>{" "}
						and a <code>className</code>.
					</p>

					<h3 id="web-engines">What draws what</h3>
					<p>
						Component names are the form, not the engine.{" "}
						<code>Chart.Line</code> and <code>Chart.TimeSeries</code> both draw
						a line — you pick between them on point count, never on renderer.
					</p>
					<PropsTable
						rows={[
							{
								description:
									"Eighteen of the twenty-one forms, Line through Treemap. Series types are registered per chart file, so a page with one line chart does not ship the sankey, sunburst and boxplot code.",
								name: "ECharts",
								type: "canvas",
							},
							{
								description:
									"Chart.TimeSeries and Chart.Sparkline. Tens of thousands of points, or forty sparklines in a table, where one scene graph per row would drop frames.",
								name: "uPlot",
								type: "canvas",
							},
							{
								description:
									"Chart.Meter is a filled track — two elements and no engine, so it is also the only form that needs no client boundary.",
								name: "Plain DOM",
								type: "no engine",
							},
						]}
					/>

					<h3 id="web-legend">Text stays in the DOM</h3>
					<p>
						Only marks and axis ticks are painted into the canvas. The legend is
						React: every chart with two or more series renders one on its own, a
						single series never does, and the labels stay selectable,
						translatable and reachable by a screen reader.
					</p>

					<h3 id="web-server-components">Server components</h3>
					<p>
						Chart props stay serializable — no formatter callbacks, no render
						props — so a server component can render a chart without a client
						boundary of its own. Anything that would have been a callback is
						expressed as data instead, which is what{" "}
						<code>ChartNumberFormat</code> is for.
					</p>
					<div className={styles.note()}>
						<strong>Colors are read off the document.</strong> A canvas takes
						color as a string, so each chart reads the resolved{" "}
						<code>--zyplot-*</code> values from the DOM after mounting and
						repaints when they change. Until that first read there is nothing
						honest to paint, so a chart shows its skeleton for a frame even with{" "}
						<code>isLoading</code> false.
					</div>
				</section>

				<section
					className={cn(
						styles.section(),
						page !== "native-package" && "hidden",
					)}
					id="native-package"
				>
					<p className={styles.kicker()}>Native</p>
					<h2>iOS and Android</h2>
					<p>
						Zyplot ships an Expo module that draws with the platform's own
						graphics stack — Swift Charts on iOS, Jetpack Compose Canvas on
						Android — behind the same <code>Chart</code> namespace the web
						renderer exposes. There is no WebView.
					</p>

					<h3 id="native-install">Installation</h3>
					<p>
						The same single package you installed for the web carries the native
						code; autolinking picks it up. Rebuild the native project after
						adding it. These are native modules, so Expo Go cannot load them:
						use a development build.
					</p>
					<CodeBlock>{`yarn add @hzblj/zyplot

npx expo prebuild
npx expo run:ios
npx expo run:android`}</CodeBlock>
					<div className={styles.note()}>
						<strong>iOS 17 and newer.</strong> Swift Charts features used by the
						renderer require a deployment target of 17.0. Set it with{" "}
						<code>expo-build-properties</code> if your app targets something
						lower.
					</div>
					<p>
						Import from <code>@hzblj/zyplot</code> and the correct renderer is
						picked per platform — the same source builds for web, iOS and
						Android.
					</p>
					<CodeBlock>{`import { Chart } from '@hzblj/zyplot'

export function Revenue() {
  return (
    <Chart.Line
      categories={['Jan', 'Feb', 'Mar']}
      format={{ prefix: '$' }}
      series={[{ id: 'revenue', label: 'Revenue', values: [42, 56, 51] }]}
    />
  )
}`}</CodeBlock>

					<h3 id="native-platform-files">Platform-specific files</h3>
					<p>
						A few forms exist on one platform only, because the underlying
						renderer has a mark the other has no honest equivalent for. They are
						not on the shared namespace — reaching for one would type-check and
						then render nothing on the platform that lacks it.
					</p>
					<p>
						Instead, give the component one file per platform and let Metro
						choose. Write the shared parts once, import the platform entry point
						in the file that is already committed to that platform, and drop the{" "}
						<code>Platform.OS</code> branches entirely.
					</p>
					<CodeBlock>{`forecast.ios.tsx      imports @hzblj/zyplot/ios
forecast.android.tsx  imports @hzblj/zyplot/android
forecast.tsx          optional web or fallback version`}</CodeBlock>
					<CodeBlock>{`// forecast.ios.tsx
import { Chart } from '@hzblj/zyplot/ios'

export const Forecast = ({ bands }: ForecastProps) => (
  <Chart.Range data={bands} height={300} />
)`}</CodeBlock>
					<CodeBlock>{`// forecast.android.tsx
import { Chart } from '@hzblj/zyplot/android'

export const Forecast = ({ bands }: ForecastProps) => (
  <Chart.Lollipop data={bands.map(toPoint)} height={300} />
)`}</CodeBlock>
					<p>
						The call site imports <code>./forecast</code> with no extension and
						never learns which one it got. This is the same convention Expo's
						own UI packages use.
					</p>
					<div className={styles.note()}>
						<strong>Keep a base file for TypeScript.</strong> <code>tsc</code>{" "}
						does not know about platform extensions, so <code>./forecast</code>{" "}
						needs a plain <code>forecast.tsx</code> to resolve to. It doubles as
						the web version, or returns <code>null</code> if the component is
						native-only.
					</div>

					<h3 id="native-coverage">Chart coverage</h3>
					<p>
						All twenty-one shared chart kinds render on both native platforms,
						and each platform adds two of its own. The props are the same ones
						documented under Charts.
					</p>
					<PropsTable
						rows={[
							{
								description:
									"Line, Area, Bar, StackedBar, TimeSeries, Sparkline, Scatter, Histogram.",
								name: "Cartesian",
								type: "web · iOS · Android",
							},
							{
								description:
									"Pie, Gauge, Meter, Radar, Sunburst, Treemap, Funnel, Sankey.",
								name: "Radial and flow",
								type: "web · iOS · Android",
							},
							{
								description:
									"Candlestick, Boxplot, DivergingBar, Dumbbell, Heatmap.",
								name: "Statistical and finance",
								type: "web · iOS · Android",
							},
							{
								description:
									"Chart.Range and Chart.Rule, built on Swift Charts marks with no web equivalent.",
								name: "iOS extensions",
								type: "iOS only",
							},
							{
								description:
									"Chart.Waterfall and Chart.Lollipop, with no web equivalent.",
								name: "Android extensions",
								type: "Android only",
							},
						]}
					/>

					<h3 id="native-differences">Differences from web</h3>
					<PropsTable
						rows={[
							{
								description:
									"Native charts have no DOM node to style. Use height and plot instead.",
								name: "className",
								type: "web only",
							},
							{
								description:
									"Pattern fills answer forced-colors and print, which a native chart never meets. Not part of the native props — the compiler rejects it rather than the renderer ignoring it.",
								name: "texture",
								type: "web only",
							},
							{
								description:
									"Native has no custom skeleton slot; isLoading draws the platform spinner.",
								name: "skeleton",
								type: "web only",
							},
							{
								defaultValue: '"system"',
								description:
									"Per chart on native: there is no cascade to inherit through, so Chart.Provider scopes surface and theme but not the color mode.",
								name: "colorMode",
								type: "shared",
							},
							{
								description:
									"Delivered through onInteraction on both platforms, with haptics available natively.",
								name: "interaction",
								type: "shared",
							},
							{
								description:
									"Boxplot terminology is honoured natively too — the tooltip shows the five-number summary in your wording.",
								name: "labels",
								type: "shared",
							},
						]}
					/>
				</section>

				<section
					className={cn(styles.section(), page !== "native-ios" && "hidden")}
					id="native-ios"
				>
					<p className={styles.kicker()}>Native</p>
					<h2>iOS</h2>
					<p>
						<code>@hzblj/zyplot/ios</code> renders with SwiftUI and Swift
						Charts. Chart configuration crosses the bridge as JSON and is
						decoded into native models, so every prop stays serializable.
						Importing it commits a file to iOS, so name that file{" "}
						<code>*.ios.tsx</code>.
					</p>
					<CodeBlock>{`// price.ios.tsx
import { Chart } from '@hzblj/zyplot/ios'

export function Price() {
  return (
    <Chart.Candlestick
      data={candles}
      format={{ prefix: '$' }}
      onInteraction={(event) => console.log(event.category, event.value)}
      showVolume
    />
  )
}`}</CodeBlock>

					<h3 id="native-ios-extensions">iOS-only charts</h3>
					{/*
					 * No import instructions here. The section opens with the one this
					 * page needs, and why these two are off the shared namespace at all
					 * is the platform-files part of the native overview — said a third
					 * time next to the badge that already says "iOS", it stopped being
					 * information.
					 */}
					<div className={styles.chartTitleRow()}>
						<p>Two marks Swift Charts has that neither other renderer does.</p>
						<PlatformBadges platforms={["ios"]} />
					</div>
					<PropsTable
						rows={[
							{
								description:
									"Shaded band between a low and a high per category — forecast ranges, confidence intervals.",
								name: "Chart.Range",
								required: true,
								type: "ChartRangePropsIos",
							},
							{
								description:
									"Reference rules at a value, optionally spanning a start and end.",
								name: "Chart.Rule",
								required: true,
								type: "ChartRulePropsIos",
							},
						]}
					/>

					<h3 id="native-ios-axis">iOS axis options</h3>
					<p>
						<code>xAxis</code> and <code>yAxis</code> accept everything{" "}
						<code>ChartAxisOptions</code> defines, plus these Swift Charts
						scrolling controls.
					</p>
					<PropsTable
						rows={[
							{
								description:
									"Length of the visible x domain. Setting it makes the plot horizontally scrollable.",
								name: "xAxis.visibleDomain",
								type: "number",
							},
							{
								description: "Initial scroll offset along the x axis.",
								name: "xAxis.scrollPosition",
								type: "number | string",
							},
							{
								description: "Extra padding before the first mark.",
								name: "yAxis.plotDimensionStartPadding",
								type: "number",
							},
							{
								description: "Extra padding after the last mark.",
								name: "yAxis.plotDimensionEndPadding",
								type: "number",
							},
						]}
					/>
				</section>

				<section
					className={cn(
						styles.section(),
						page !== "native-android" && "hidden",
					)}
					id="native-android"
				>
					<p className={styles.kicker()}>Native</p>
					<h2>Android</h2>
					<p>
						<code>@hzblj/zyplot/android</code> draws on a Jetpack Compose{" "}
						<code>Canvas</code>. Marks, axis text, grid, annotations and the
						tooltip are all drawn by the module, so a chart is one view rather
						than a tree of them. Importing it commits a file to Android, so name
						that file <code>*.android.tsx</code>.
					</p>
					<CodeBlock>{`// spend.android.tsx
import { Chart } from '@hzblj/zyplot/android'

export function Spend() {
  return (
    <Chart.Waterfall
      data={movements}
      format={{ prefix: '$', decimals: 0 }}
      interaction={{ haptics: true, tooltip: true }}
    />
  )
}`}</CodeBlock>

					<h3 id="native-android-extensions">Android-only charts</h3>
					{/* Same reason as the iOS pair above: the import is said once, up there. */}
					<div className={styles.chartTitleRow()}>
						<p>
							Two forms the Compose Canvas draws that neither other renderer
							does.
						</p>
						<PlatformBadges platforms={["android"]} />
					</div>
					<PropsTable
						rows={[
							{
								description:
									"Running total across signed movements, colored by direction.",
								name: "Chart.Waterfall",
								required: true,
								type: "ChartWaterfallPropsAndroid",
							},
							{
								description:
									"A stem and a dot per category — a bar chart with the ink of a dot plot.",
								name: "Chart.Lollipop",
								required: true,
								type: "ChartLollipopPropsAndroid",
							},
						]}
					/>

					<h3 id="native-android-axis">Android axis options</h3>
					<p>
						<code>xAxis</code> and <code>yAxis</code> accept everything{" "}
						<code>ChartAxisOptions</code> defines, plus overflow handling for
						long tick labels.
					</p>
					<PropsTable
						rows={[
							{
								defaultValue: '"ellipsis"',
								description: "How a tick label that exceeds its band is cut.",
								name: "xAxis.labelOverflow",
								type: '"clip" | "ellipsis" | "visible"',
							},
							{
								defaultValue: '"ellipsis"',
								description: "How a tick label that exceeds the gutter is cut.",
								name: "yAxis.labelOverflow",
								type: '"clip" | "ellipsis" | "visible"',
							},
						]}
					/>
				</section>

				<section
					className={cn(styles.section(), page !== "theming" && "hidden")}
					id="theming"
				>
					<h2>Theming</h2>
					<p>
						<code>Chart.Provider</code> scopes a palette to a subtree. It writes
						what you pass as <code>--zyplot-*</code> custom properties on its
						own wrapper, and the charts inside read the resolved values back off
						the DOM. A key you leave out keeps the stylesheet's value, including
						that value's dark variant.
					</p>
					<div className={styles.note()}>
						<strong>A theme key holds in both modes.</strong> The provider
						writes inline custom properties, which outrank the stylesheet's
						light and dark rules alike — so a color passed here is the color in
						both. When a palette has to change with the mode, set it in CSS
						instead.
					</div>
					<CodeBlock>{`<Chart.Provider
  theme={{
    colors: {
      categorical: ['#7c3aed', '#0284c7', '#ea580c'],
      grid: '#e5e7eb',
    },
    typography: {
      fontFamily: 'Geist, sans-serif',
    },
  }}
>
  <Dashboard />
</Chart.Provider>`}</CodeBlock>

					<h3 id="theme-keys">The theme contract</h3>
					<p>
						Every key is optional and takes any color the browser can resolve.
						There is no <code>background</code> here — the box a chart sits in
						is <code>surface</code>, below.
					</p>
					<div className={styles.note()}>
						<strong>This is the web shape.</strong> The native renderers take a{" "}
						<code>ChartTheme</code> of their own — no <code>sequential</code>,{" "}
						<code>diverging</code>, <code>muted</code> or <code>border</code>,
						and a <code>background</code> instead — and they accept it per chart
						as well as from the provider, because a native chart has no cascade
						to read a variable out of.
					</div>
					<CodeBlock>{`type ChartTheme = {
  colors?: {
    /** Slots 1…7, in order. A series takes one by index or by its own slot. */
    categorical?: string[]
    /** Low → high, five steps. Heatmap, treemap, sunburst. */
    sequential?: string[]
    /** Signed scales: diverging bars, and any positive/negative encoding. */
    diverging?: {
      negative?: string
      negativeSoft?: string
      neutral?: string
      positive?: string
      positiveSoft?: string
    }
    /** The de-emphasis grey — every series that is context rather than subject. */
    muted?: string
    axis?: string
    grid?: string
    /** Axis and data labels. */
    label?: string
    /** Tooltip fill. */
    surface?: string
    /** Tooltip hairline. */
    border?: string
    /** The unfilled part of a gauge or a meter. */
    track?: string
  }
  typography?: {
    /** A resolved family name. A canvas cannot read var(--font-sans). */
    fontFamily?: string
  }
}`}</CodeBlock>
					<div className={styles.note()}>
						<strong>Seven and five.</strong> Only the first seven{" "}
						<code>categorical</code> entries and the first five{" "}
						<code>sequential</code> steps are ever read. An eighth series color
						is one no color-blind reader can separate from a slot that already
						exists, so the eighth series is an "other" bucket, a small multiple,
						or a second encoding through <code>texture</code> — not a longer
						palette.
					</div>

					<h3 id="surface">The chart surface</h3>
					<p>
						<code>theme</code> answers "what colour is this series";{" "}
						<code>surface</code> answers "what does the container look like".
						Keeping them apart is what lets a design system set one card
						treatment for every chart while each chart keeps its own palette.
					</p>
					<CodeBlock>{`<Chart.Provider surface={{ background: '#fff', cornerRadius: 16, padding: 12 }}>
  <Chart.Line categories={categories} series={series} />
  <Chart.Bar surface={{ cornerRadius: 24 }} categories={categories} series={series} />
</Chart.Provider>`}</CodeBlock>
					<p>
						A chart's own <code>surface</code> merges over the provider's key by
						key, so the bar above rounds its corners without restating the
						background it inherits.
					</p>
					<PropsTable
						rows={[
							{
								description: "Fill behind the plot. Any CSS or hex colour.",
								name: "background",
								type: "string",
							},
							{
								description: "Outline around the container.",
								name: "border",
								type: "{ color?: string; width?: number }",
							},
							{
								defaultValue: "0",
								description:
									"Corner rounding, in px on web and points on native.",
								name: "cornerRadius",
								type: "number",
							},
							{
								description:
									"A number applies to all four sides; the object form takes horizontal, vertical and the individual sides, most specific winning.",
								name: "padding",
								type: "number | ChartSurfacePadding",
							},
						]}
					/>
					<div className={styles.note()}>
						<strong>The same four keys everywhere.</strong> Only properties that
						mean the same thing to a <code>div</code>, a SwiftUI view and a
						Compose <code>Canvas</code> live here. Anything that would have to
						be approximated on one of the three is deliberately absent.
					</div>

					<h3 id="provider-props">Provider props</h3>
					<PropsTable
						rows={[
							{
								description: "Charts rendered inside the scope.",
								name: "children",
								required: true,
								type: "ReactNode",
							},
							{
								description: "Scoped color and typography overrides.",
								name: "theme",
								type: "ChartTheme",
							},
							{
								description:
									"Container treatment every chart in the subtree inherits, merged key by key with the chart's own.",
								name: "surface",
								type: "ChartSurface",
							},
							{
								defaultValue: '"inherit"',
								description:
									"How the light/dark palette is resolved for the subtree.",
								name: "colorMode",
								type: '"inherit" | "light" | "dark" | "system"',
							},
							{
								description:
									"CSS class on the wrapper element the provider renders.",
								name: "className",
								type: "string",
							},
						]}
					/>
					<div className={styles.note()}>
						<strong>The provider renders an element.</strong> The custom
						properties have to land somewhere, so the scope is a real{" "}
						<code>div</code> in your layout rather than context alone. It
						carries <code>className</code> for that reason.
					</div>
				</section>

				<section
					className={cn(styles.section(), page !== "dark-mode" && "hidden")}
					id="dark-mode"
				>
					<h2>Light and dark mode</h2>
					<p>
						Both palettes ship in the stylesheet. The dark one is keyed off{" "}
						<code>.dark</code> or <code>data-theme="dark"</code> on the document
						root — the two conventions Tailwind and next-themes already write —
						and a root that pins neither falls back to{" "}
						<code>prefers-color-scheme</code>. A project doing either needs no
						chart-specific wiring.
					</p>

					<h3 id="color-modes">Resolution</h3>
					<p>
						<code>Chart.Provider</code> pins a subtree instead. Its{" "}
						<code>colorMode</code> lands as <code>data-zyplot-color-mode</code>{" "}
						on the wrapper, and the stylesheet resolves the palette from there.
					</p>
					<PropsTable
						rows={[
							{
								defaultValue: "default",
								description:
									"Takes whatever the document root resolved to, including the OS fallback. Charts outside a provider behave this way too.",
								name: '"inherit"',
								type: "document root",
							},
							{
								description:
									"The light palette regardless of the root, plus color-scheme: light.",
								name: '"light"',
								type: "pinned",
							},
							{
								description:
									"The dark palette regardless of the root, plus color-scheme: dark.",
								name: '"dark"',
								type: "pinned",
							},
							{
								description:
									"Follows the OS through prefers-color-scheme, ignoring the document root.",
								name: '"system"',
								type: "media query",
							},
						]}
					/>
					<div className={styles.note()}>
						<strong>Switching repaints in place.</strong> Because canvas colors
						are read off the DOM, every mounted chart watches <code>class</code>
						, <code>data-theme</code>, <code>data-zyplot-color-mode</code> and{" "}
						<code>style</code> on the root — plus the{" "}
						<code>prefers-color-scheme</code> query — and repaints from the new
						values. No remount, and no chart left painting light-mode series on
						a dark canvas.
					</div>

					<h3 id="css-variables">The CSS contract</h3>
					<p>
						These names are the public API; the Tailwind tokens behind them are
						not. Override them wherever you set the rest of your theme — the
						values below are the light defaults, and every color among them has
						a dark counterpart in the stylesheet.
					</p>
					<CodeBlock language="css">{`:root {
  /* Categorical: slots 1…7, in the order series take them. */
  --zyplot-color-categorical-1: #4400fc;
  --zyplot-color-categorical-2: #0092de;
  --zyplot-color-categorical-3: #ff5700;
  --zyplot-color-categorical-4: #9c74ff;
  --zyplot-color-categorical-5: #00a546;
  --zyplot-color-categorical-6: #006fac;
  --zyplot-color-categorical-7: #ff133c;

  /* Sequential: low → high. Heatmap, treemap, sunburst. */
  --zyplot-color-sequential-1: #b89bff;
  --zyplot-color-sequential-2: #9c74ff;
  --zyplot-color-sequential-3: #7135ff;
  --zyplot-color-sequential-4: #4400fc;
  --zyplot-color-sequential-5: #2f00ae;

  /* Diverging: signed scales. */
  --zyplot-color-diverging-negative: #d23100;
  --zyplot-color-diverging-negative-soft: #ff7d4f;
  --zyplot-color-diverging-neutral: #d9d9d9;
  --zyplot-color-diverging-positive-soft: #59c4fd;
  --zyplot-color-diverging-positive: #006fac;

  /* Chrome. */
  --zyplot-color-axis: #a6a6a6;
  --zyplot-color-grid: #f5f5f5;
  --zyplot-color-label: #666666;
  --zyplot-color-muted: #808080;
  --zyplot-color-surface: #fcfcfc;
  --zyplot-color-border: #f5f5f5;
  --zyplot-color-track: #ebebeb;

  --zyplot-font-family: inherit;
}

/* Only the keys you actually change need restating per mode. */
[data-theme='dark'] {
  --zyplot-color-categorical-1: #7135ff;
  --zyplot-color-grid: #212121;
}`}</CodeBlock>
					<p>
						The font is inherited from the page. Set{" "}
						<code>--zyplot-font-family</code> only when charts should use a
						different stack, and give it a resolved family name — a canvas
						cannot read another variable.
					</p>
					<div className={styles.note()}>
						<strong>Wide-gamut values are safe.</strong> On a P3 display these
						resolve to <code>color(display-p3 …)</code>, which ECharts' own
						parser rejects. Every color is normalized to sRGB on the way to the
						canvas, so the variable can hold whatever your design tokens hold.
					</div>
				</section>

				<section
					className={cn(styles.section(), page !== "data-types" && "hidden")}
					id="data-types"
				>
					<h2>Data types</h2>
					<p>
						Chart data is plain serializable objects — no formatter callbacks
						and no render props, which is what lets a server component render a
						chart. Labels are already translated: this package never resolves an
						i18n key. Type names in the props tables link here.
					</p>
					<h3 id="chart-series">ChartSeries</h3>
					<p>
						Used by line, area, bar, stacked bar, radar and every other
						multi-series form. Each <code>values</code> entry aligns with the
						category at the same index, so the array is as long as{" "}
						<code>categories</code>.
					</p>
					<CodeBlock>{`type ChartSeries = {
  /** Stable identity: the React key, and how hover correlates across charts. */
  id: string
  /** Already-translated display name, used by the legend and the tooltip. */
  label: string
  /** One value per category. null is a genuine gap, drawn as one, never as zero. */
  values: (number | null)[]
  /** Palette slot, 1-based. Pin it when the caller can hide series. */
  slot?: number
  /** Overrides the active palette for this series. */
  color?: string
}`}</CodeBlock>
					<p>
						An explicit <code>color</code> wins over the provider palette and
						the CSS variables. Omit <code>slot</code> and a series takes its
						index — correct for a fixed list, wrong the moment the list can be
						filtered, because the survivors get repainted and the reader has to
						re-learn the chart.
					</p>
					<CodeBlock>{`const series: ChartSeries[] = [
  {
    id: 'revenue',
    label: 'Revenue',
    values: [42, 56, null, 72],
    slot: 1,
    color: '#16a34a',
  },
]`}</CodeBlock>
					<h3 id="chart-datum">ChartDatum</h3>
					<p>
						A labelled scalar — the shape part-to-whole and ranked forms
						consume: pie, funnel, gauge segments, diverging bars.
					</p>
					<CodeBlock>{`type ChartDatum = {
  id: string
  label: string
  value: number
  slot?: number
  color?: string
}`}</CodeBlock>
					<h3 id="chart-options">Axes and number formatting</h3>
					<p>
						<code>axis</code> is the on/off switch both cartesian axes share;{" "}
						<code>format</code> is one description of a number, applied to axis
						ticks, tooltips and direct labels alike, so they can never disagree.
					</p>
					<CodeBlock>{`type ChartAxes = {
  x?: boolean
  y?: boolean
}

type ChartNumberFormat = {
  /** Fraction digits. Defaults to 0. */
  decimals?: number
  /** BCP 47 tag for grouping and decimal separators. Defaults to the runtime locale. */
  locale?: string
  /** Rendered before the number — a currency symbol, typically. */
  prefix?: string
  /** Rendered after the number — a unit or a percent sign. */
  suffix?: string
}`}</CodeBlock>
					<h3 id="chart-legend">ChartLegendItem</h3>
					<p>
						What <code>Chart.Legend</code> takes when you place identity
						yourself. The color is already resolved — a swatch is a color, not a
						slot to look up.
					</p>
					<CodeBlock>{`type ChartLegendItem = {
  id: string
  label: string
  color: string
}`}</CodeBlock>
					<h3 id="specialized-data">Specialized chart data</h3>
					<p>
						Some forms take a shape-specific contract instead of{" "}
						<code>ChartSeries</code>, because their encoding is not "one value
						per category". The field names describe the marks directly.
					</p>
					<CodeBlock>{`/** Chart.Radar — one axis per row. Axes are scaled independently. */
type ChartRadarAxis = {
  label: string
  max: number
}

/** Chart.Heatmap — addressed by axis index; null renders empty, not as the ramp's low end. */
type ChartHeatmapCell = {
  columnIndex: number
  rowIndex: number
  value: number | null
}

/** Chart.Dumbbell — a before → after pair per row. */
type ChartDumbbellRow = {
  id: string
  label: string
  before: number
  after: number
}

/** Chart.Boxplot — the five-number summary, plus outliers you have already picked. */
type ChartBoxplotGroup = {
  id: string
  label: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outliers?: number[]
}

/** Required, because "Q1" is not a word every reader of your product knows. */
type BoxplotLabels = {
  min: string
  q1: string
  median: string
  q3: string
  max: string
}

/** Chart.Sankey — nodes, and the weighted edges that address them by id. */
type ChartFlowNode = {
  id: string
  label: string
  slot?: number
  color?: string
}

type ChartFlowLink = {
  source: string
  target: string
  value: number
}

/** Chart.Treemap and Chart.Sunburst — leaves carry a value, parents sum their children. */
type ChartHierarchyNode = {
  id: string
  label: string
  value?: number
  children?: ChartHierarchyNode[]
  slot?: number
  color?: string
}

/** Chart.Scatter — an unordered two-measure space. size turns points into bubbles. */
type ChartScatterSeries = {
  id: string
  label: string
  points: Array<{
    x: number
    y: number
    size?: number
    label?: string
  }>
  slot?: number
  color?: string
}

/** Chart.TimeSeries — parallel arrays, because that is what uPlot consumes. */
type ChartTimePoints = {
  /** Unix seconds, strictly ascending. */
  timestamps: number[]
  /** One entry per series, each as long as timestamps. */
  values: (number | null)[][]
}`}</CodeBlock>

					<h3 id="finance-data">Candlestick data</h3>
					<p>
						One entry per session. <code>volume</code> is what{" "}
						<code>showVolume</code> draws, and <code>timestamp</code> is only
						needed when something outside the chart has to line up with the
						session.
					</p>
					<CodeBlock>{`type ChartCandlestickDatum = {
  id: string
  category: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
  /** Unix seconds. */
  timestamp?: number
}

type ChartCandlestickStyle = {
  upColor?: string
  downColor?: string
  neutralColor?: string
  /** Draws rising candles as outlines — the convention on most trading desks. */
  hollowUp?: boolean
  candleWidth?: number
  wickWidth?: number
  volumeUpColor?: string
  volumeDownColor?: string
  /** Share of the plot height the volume histogram takes. */
  volumeHeightRatio?: number
}`}</CodeBlock>

					<h3 id="axis-options">Axis options</h3>
					<p>
						<code>axis</code> switches an axis off; <code>xAxis</code> and{" "}
						<code>yAxis</code> describe one. Both are read by line, area, bar,
						stacked bar and candlestick — the forms whose readers pin a domain,
						change the scale or annotate a value. The other forms take the
						visibility switch only, which is why their props tables list{" "}
						<code>axis</code> alone.
					</p>
					<CodeBlock>{`type ChartAxisOptions = {
  visible?: boolean
  label?: string
  /** "auto" | "category" | "linear" | "log" | "time" */
  scale?: ChartAxisScale
  /** Pins the extent. Omit either end to keep it computed. */
  domain?: { min?: number; max?: number }
  format?: ChartNumberFormat
  grid?: boolean
  gridDash?: number[]
  labelRotation?: number
  /** Which side the axis is drawn on: "start" | "end". */
  position?: ChartAxisPosition
  reversed?: boolean
  /** A hint, not a guarantee — the engine still picks readable ticks. */
  tickCount?: number
  /** Exact ticks, when the reader is looking for specific ones. */
  tickValues?: (number | string)[]
}`}</CodeBlock>

					<h3 id="annotations">Annotations</h3>
					<p>
						A union discriminated on <code>type</code>. Coordinates are{" "}
						<code>number | string</code>: a category name on a category axis, a
						value on a linear or time one.
					</p>
					<CodeBlock>{`type ChartAnnotation =
  | ChartLineAnnotation
  | ChartRangeAnnotation
  | ChartPointAnnotation
  | ChartTextAnnotation

/** A target, a threshold, a launch date. */
type ChartLineAnnotation = {
  type: 'line'
  id: string
  axis: 'x' | 'y'
  value: number | string
  label?: string
  color?: string
  dash?: number[]
}

/** A shaded span — a quarter, an incident window, a tolerance band. */
type ChartRangeAnnotation = {
  type: 'range'
  id: string
  axis: 'x' | 'y'
  start: number | string
  end: number | string
  label?: string
  color?: string
  opacity?: number
}

type ChartPointAnnotation = {
  type: 'point'
  id: string
  x: number | string
  y: number
  label?: string
  color?: string
  symbol?: ChartSymbol
}

type ChartTextAnnotation = {
  type: 'text'
  id: string
  text: string
  x?: number | string
  y?: number
  color?: string
}`}</CodeBlock>

					<h3 id="interaction">Interaction</h3>
					<p>
						<code>interaction</code> is what the chart does on its own;{" "}
						<code>onInteraction</code> is how your code hears about it. The
						event is one flat serializable shape for every form, so a handler
						written for a bar chart works on a line chart.
					</p>
					<CodeBlock>{`type ChartInteraction = {
  /** "axis" | "nearest" | "series" | "none" */
  hover?: ChartHoverMode
  /** "both" | "x" | "y" | "none" */
  crosshair?: ChartCrosshairMode
  tooltip?: boolean
  /** "single" | "multiple" | "none" */
  selection?: ChartSelectionMode
  pan?: boolean
  zoom?: boolean
  /** How far a hovered mark grows. */
  highlightScale?: number
  /** How far the rest fades while one mark is hovered. */
  dimOpacity?: number
  /** Native only — the web has no honest equivalent. */
  haptics?: boolean
}

type ChartInteractionEvent = {
  seriesId?: string
  category?: string
  value?: number
  x?: number
  y?: number
  /** Unix seconds, on the time-based forms. */
  timestamp?: number
  /** Pointer position in the native view's coordinate space. */
  nativeX?: number
  nativeY?: number
}`}</CodeBlock>
					<div className={styles.note()}>
						<strong>A handler is a client boundary.</strong> Everything else on
						a chart is serializable data, so a server component can render it —{" "}
						<code>onInteraction</code> is the one prop that cannot cross, and
						the file that passes it needs <code>"use client"</code>.
					</div>

					<h3 id="plot-style">Plot, series style and animation</h3>
					<p>
						<code>surface</code> is the box the chart sits in; <code>plot</code>{" "}
						is the drawing area inside it. <code>seriesStyles</code> is keyed by{" "}
						<code>ChartSeries.id</code>, so a style survives reordering and
						filtering the way <code>slot</code> does for color.
					</p>
					<CodeBlock>{`type ChartPlotStyle = {
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  /** Clips marks to the plot area — the honest choice when a domain is pinned. */
  clip?: boolean
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number }
}

type ChartSeriesStyle = {
  color?: string
  strokeWidth?: number
  strokeDash?: number[]
  fillOpacity?: number
  opacity?: number
  /** "circle" | "diamond" | "square" | "triangle" | "none" */
  symbol?: ChartSymbol
  symbolSize?: number
}

type ChartAnimation = {
  enabled?: boolean
  /** The entrance. Turn it off for a chart that re-renders on every keystroke. */
  initial?: boolean
  /** The transition when data changes under a mounted chart. */
  updates?: boolean
  duration?: number
  delay?: number
  /** "linear" | "ease-in" | "ease-out" | "ease-in-out" | "spring" */
  easing?: ChartAnimationEasing
}`}</CodeBlock>
				</section>

				<section
					className={cn(
						styles.section(),
						page !== "loading-states" && "hidden",
					)}
					id="loading-states"
				>
					<h2>Loading states</h2>
					<p>
						Hold <code>isLoading</code> true while the data is in flight. The
						chart shows the shape it is about to be, at the height it will
						occupy, and cross-fades into the plot when the flag drops — same
						grid cell, same size, so nothing on the page moves when the marks
						land.
					</p>
					<CodeBlock>{`<Chart.Line
  categories={categories}
  height={320}
  isLoading={revenue.isPending}
  series={series}
/>`}</CodeBlock>
					<p>
						The placeholder is derived from the props the chart already has: one
						legend row per series, and axis rows only where an axis is visible.
						There is nothing to configure and nothing to keep in sync when the
						chart changes.
					</p>
					<div className={styles.note()}>
						<strong>The first frame is a loading state too.</strong> A chart has
						to read its colors off the document before it can paint, so the
						built-in placeholder also covers that frame — with{" "}
						<code>isLoading</code> false and data in hand. The wrapper carries{" "}
						<code>aria-busy</code> while either is true, and the placeholder
						itself is <code>aria-hidden</code>.
					</div>
					<div className={styles.note()}>
						<strong>Shape-matched placeholders are a web feature.</strong>{" "}
						<code>isLoading</code> means the same thing on iOS and Android, but
						there it draws the platform's own spinner: no <code>.Skeleton</code>{" "}
						component and no <code>skeleton</code> slot, because there is no DOM
						to build one out of.
					</div>
					<h3 id="skeleton-props">Skeleton props</h3>
					<p>
						Every form also exposes its placeholder on its own, as{" "}
						<code>Chart.Line.Skeleton</code> — for when the chart is not mounted
						yet at all: a Suspense fallback, a route placeholder, a dashboard
						slot whose query has not started. These props apply only there; a
						chart driven by <code>isLoading</code> fills them in itself.
					</p>
					<CodeBlock>{`<Suspense fallback={<Chart.Line.Skeleton height={320} legendCount={2} />}>
  <Revenue />
</Suspense>`}</CodeBlock>
					<PropsTable
						rows={[
							{
								defaultValue: "240",
								description:
									"Reserved height. Match the chart it stands in for.",
								name: "height",
								type: "number",
							},
							{
								defaultValue: "0",
								description:
									"Legend rows to reserve. Drawn from two up — a single series gets no legend, so reserving a row for one would leave a gap the chart never fills.",
								name: "legendCount",
								type: "number",
							},
							{
								defaultValue: "true",
								description: "Reserves the horizontal-axis label row.",
								name: "xAxis",
								type: "boolean",
							},
							{
								defaultValue: "true",
								description: "Reserves the vertical-axis label column.",
								name: "yAxis",
								type: "boolean",
							},
							{
								description: "CSS class applied to the skeleton root.",
								name: "className",
								type: "string",
							},
						]}
					/>
					<h3 id="custom-skeleton">Custom skeleton</h3>
					<p>
						<code>skeleton</code> takes a rendered element, not a component, and
						replaces the built-in one while <code>isLoading</code> is true. Keep
						its height equal to the chart's so the swap still costs no layout
						shift.
					</p>
					<CodeBlock>{`function RevenueSkeleton({ height = 320 }) {
  return (
    <div
      aria-label="Loading revenue chart"
      aria-busy="true"
      role="status"
      style={{ height }}
    >
      <div className="skeleton-title" />
      <div className="skeleton-plot" />
    </div>
  )
}

<Chart.Line
  isLoading
  skeleton={<RevenueSkeleton height={320} />}
  height={320}
  axis={{ x: false, y: true }}
  categories={categories}
  series={series}
/>`}</CodeBlock>
					<div className={styles.note()}>
						<strong>
							It covers <code>isLoading</code> only.
						</strong>{" "}
						The frame before the first paint still uses the built-in
						placeholder, because that one is derived from the chart and always
						matches it. Legend rows and axis gutters are yours to mirror here —{" "}
						<code>axis</code> shapes the built-in placeholder, not this one.
					</div>
				</section>

				<section
					className={cn(styles.section(), page !== "composition" && "hidden")}
					id="composition"
				>
					<h2>Frame and legend</h2>
					<p>
						<code>Chart.Frame</code> is the card a chart can sit in: a title, a
						description, one row for filters, and a caption underneath for the
						source or the caveat. It is optional — a chart dropped straight into
						a dashboard grid needs no card — and when it is used it is the
						standard card recipe, so a chart never invents its own container.
					</p>
					<CodeBlock>{`<Chart.Frame
  title="Revenue"
  description="Monthly recurring revenue"
  caption="Source: billing ledger"
>
  <Chart.Line categories={categories} series={series} />
</Chart.Frame>`}</CodeBlock>
					<p>
						The header only exists when at least one of <code>title</code>,{" "}
						<code>description</code> and <code>actions</code> is set, so a frame
						with none of them is a plain card around the plot.
					</p>
					<div className={styles.note()}>
						<strong>
							Frame is not <code>surface</code>.
						</strong>{" "}
						The frame is a card with type in it, rendered around the chart;{" "}
						<code>surface</code> is the box the plot itself is painted on, and
						it exists on native too. Use the frame for a titled dashboard card,{" "}
						<code>surface</code> when the chart needs its own background or
						padding.
					</div>
					<h3 id="frame-props">Frame props</h3>
					<PropsTable
						rows={[
							{
								description: "Chart or composed visualization content.",
								name: "children",
								required: true,
								type: "ReactNode",
							},
							{
								description: "Heading rendered above the chart.",
								name: "title",
								type: "string",
							},
							{
								description: "Supporting text below the title.",
								name: "description",
								type: "string",
							},
							{
								description: "Filters and controls aligned with the heading.",
								name: "actions",
								type: "ReactNode",
							},
							{
								description: "Source, method or caveat below the chart.",
								name: "caption",
								type: "string",
							},
							{
								description: "CSS class applied to the frame.",
								name: "className",
								type: "string",
							},
						]}
					/>
					<h3 id="legend-props">Legend props</h3>
					<p>
						A chart renders its own legend from two series up, and none for a
						single one, so <code>Chart.Legend</code> is for the surface that
						places identity itself — one legend above a row of small multiples,
						or a legend that doubles as a series filter. Colors come in already
						resolved, so pin <code>slot</code> or <code>color</code> on the
						series and both agree by construction.
					</p>
					<PropsTable
						rows={[
							{
								description: "Stable IDs, labels and resolved swatch colors.",
								name: "items",
								required: true,
								type: "ChartLegendItem[]",
							},
							{
								description: "CSS class applied to the legend.",
								name: "className",
								type: "string",
							},
						]}
					/>
				</section>

				{currentChart && (
					<ChartSection chart={currentChart} preferences={preferences} />
				)}

				<nav aria-label="Documentation pagination" className={styles.pager()}>
					{previousPage ? (
						<Link
							className={styles.pagerLink()}
							href={
								previousPage === "introduction"
									? "/docs"
									: `/docs/${chartDocs.some((chart) => chart.id === previousPage) ? `charts/${previousPage}` : previousPage === "web-package" ? "web" : previousPage}`
							}
						>
							← Previous
						</Link>
					) : (
						<span />
					)}
					{nextPage && (
						<Link
							className={styles.pagerLink()}
							href={`/docs/${chartDocs.some((chart) => chart.id === nextPage) ? `charts/${nextPage}` : nextPage === "web-package" ? "web" : nextPage}`}
						>
							Continue →
						</Link>
					)}
				</nav>
			</main>

			<aside className={styles.toc()}>
				<p className={styles.tocLabel()}>On this page</p>
				<nav aria-label="On this page" className={styles.tocNav()}>
					{pageHeadings.map((heading) => (
						<a href={`#${heading.id}`} key={heading.id}>
							{heading.label}
						</a>
					))}
				</nav>
			</aside>
		</>
	);
};
