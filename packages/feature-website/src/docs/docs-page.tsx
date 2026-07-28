"use client";

import { Chart } from "@hzblj/zyplot";
import { docsStyles } from "../docs-styles";
import { ThemeToggle } from "../theme-toggle";
import { ChartSection } from "./components/chart-section";
import { Example } from "./components/example";
import { PropsTable } from "./components/props-table";
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

const baseProps: PropRow[] = [
	{
		defaultValue: "{ x: true, y: true }",
		description:
			"Controls horizontal and vertical axis visibility on cartesian charts.",
		name: "axes",
		type: "ChartAxes",
	},
	{
		description: "CSS class applied to the chart root.",
		name: "className",
		type: "string",
	},
	{
		defaultValue: "240",
		description: "Reserved plot height in pixels.",
		name: "height",
		type: "number",
	},
	{
		defaultValue: "false",
		description: "Shows the matching stable skeleton while data is loading.",
		name: "isLoading",
		type: "boolean",
	},
	{
		description: "Custom loading UI replacing the built-in chart skeleton.",
		name: "skeleton",
		type: "ReactNode",
	},
	{
		defaultValue: "false",
		description: "Adds patterns as a second visual encoding.",
		name: "texture",
		type: "boolean",
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

const withBase = (...props: PropRow[]) => [...props, ...baseProps];

const code = (name: string, body: string) =>
	`import { Chart } from '@hzblj/zyplot-platform-web'

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
		preview: (
			<Chart.Line
				categories={categories}
				format={{ prefix: "$" }}
				height={300}
				series={series}
			/>
		),
		props: withBase(
			categoriesProp,
			seriesProp,
			formatProp,
			{
				description: "Keeps one series colored and mutes the others.",
				name: "emphasisId",
				type: "string",
			},
			{
				defaultValue: "false",
				description: "Draws rounded interpolation between observations.",
				name: "isSmooth",
				type: "boolean",
			},
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
		preview: (
			<Chart.Area
				categories={categories}
				height={300}
				isStacked
				series={series}
			/>
		),
		props: withBase(
			categoriesProp,
			seriesProp,
			formatProp,
			{
				description: "Keeps one series colored and mutes the others.",
				name: "emphasisId",
				type: "string",
			},
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
		preview: <Chart.Bar categories={categories} height={300} series={series} />,
		props: withBase(
			categoriesProp,
			seriesProp,
			formatProp,
			{
				description: "Keeps one series colored and mutes the others.",
				name: "emphasisId",
				type: "string",
			},
			{
				defaultValue: '"vertical"',
				description: "Direction in which bars grow.",
				name: "orientation",
				type: '"horizontal" | "vertical"',
			},
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
		preview: (
			<Chart.StackedBar
				categories={categories}
				height={300}
				isNormalized
				series={series}
			/>
		),
		props: withBase(
			categoriesProp,
			seriesProp,
			formatProp,
			{
				description: "Keeps one series colored and mutes the others.",
				name: "emphasisId",
				type: "string",
			},
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
			baseProps[0] as PropRow,
		],
		when: "Use instead of a gauge when vertical space is limited.",
	},
	{
		code: code("Histogram", `      values={observations}\n      binCount={8}`),
		description: "Reveal the distribution of raw numeric observations.",
		id: "histogram",
		name: "Histogram",
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
		),
		when: "Use when shape, spread and outliers matter more than individual values.",
	},
	{
		code: code("Boxplot", `      groups={groups}\n      labels={labels}`),
		description: "Compare five-number summaries and outliers across groups.",
		id: "boxplot",
		name: "Boxplot",
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
		),
		when: "Use to compare distributions when raw observations are not required.",
	},
	{
		code: code(
			"DivergingBar",
			`      data={changes}\n      format={{ suffix: '%' }}`,
		),
		description: "Compare positive and negative values around a shared zero.",
		id: "diverging-bar",
		name: "Diverging bar",
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
		),
		when: "Use to expose clusters and patterns in a dense matrix.",
	},
	{
		code: code("Radar", `      axes={axes}\n      series={series}`),
		description:
			"Compare multivariate profiles on a shared set of bounded axes.",
		id: "radar",
		name: "Radar",
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
			seriesProp,
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
		),
		when: "Use for correlation and distribution across two numeric dimensions.",
	},
	{
		code: code("Sankey", `      nodes={nodes}\n      links={links}`),
		description: "Trace weighted flow between named nodes and stages.",
		id: "sankey",
		name: "Sankey",
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
		props: withBase(
			{
				description:
					"Parallel timestamp and value arrays optimized for density.",
				name: "points",
				required: true,
				type: "ChartTimePoints",
			},
			seriesProp,
			formatProp,
		),
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
			...baseProps.slice(0, 3),
		],
		when: "Use inside a stat tile or table row as context, never for exact lookup.",
	},
	{
		code: code(
			"Stat",
			`      label="Monthly revenue"
      value={84200}
      delta={12.4}
      direction="up-is-good"
      trend={trend}`,
		),
		description:
			"Present one important KPI with change and optional recent trend.",
		id: "stat",
		name: "Stat",
		preview: (
			<Chart.Stat
				delta={12.4}
				direction="up-is-good"
				format={{ prefix: "$" }}
				label="Monthly revenue"
				since="vs last month"
				trend={[42, 46, 45, 53, 61, 68, 72]}
				value={84_200}
			/>
		),
		props: [
			{
				description: "Human-readable KPI name.",
				name: "label",
				required: true,
				type: "string",
			},
			{
				description: "Primary numeric value.",
				name: "value",
				required: true,
				type: "number",
			},
			formatProp,
			{
				description: "Change against the comparison period.",
				name: "delta",
				type: "number",
			},
			{
				description: "Formatting used for the change value.",
				name: "deltaFormat",
				type: "ChartNumberFormat",
			},
			{
				defaultValue: '"neutral"',
				description: "Defines whether rising or falling is positive.",
				name: "direction",
				type: '"neutral" | "up-is-good" | "down-is-good"',
			},
			{
				description: "Label for the comparison period.",
				name: "since",
				type: "string",
			},
			{
				description: "Recent values rendered as a sparkline.",
				name: "trend",
				type: "number[]",
			},
			baseProps[0] as PropRow,
		],
		when: "Use for a KPI that deserves more visual weight than a chart axis label.",
	},
];

export const DocsPage = () => (
	<div className={styles.site()}>
		<header className={styles.mobileHeader()}>
			<a className={styles.wordmark()} href="/">
				zyplot
			</a>
			<a href="#getting-started">Docs</a>
			<ThemeToggle />
		</header>

		<aside className={styles.sidebar()}>
			<div className={styles.sidebarTop()}>
				<a className={styles.wordmark()} href="/">
					zyplot
				</a>
				<span>Docs</span>
			</div>
			<nav aria-label="Documentation" className="grid">
				<div className={styles.navGroup()}>
					<p className={styles.navGroupLabel()}>Getting started</p>
					<a className={styles.navLink()} href="#getting-started">
						Introduction
					</a>
					<a className={styles.navLink()} href="#installation">
						Installation
					</a>
					<a className={styles.navLink()} href="#first-chart">
						Your first chart
					</a>
				</div>
				<div className={styles.navGroup()}>
					<p className={styles.navGroupLabel()}>Web</p>
					<a className={styles.navLink()} href="#web-package">
						Overview
					</a>
					<a className={styles.navLink()} href="#theming">
						Theming
					</a>
					<a className={styles.navLink()} href="#dark-mode">
						Light and dark mode
					</a>
					<a className={styles.navLink()} href="#data-types">
						Data types
					</a>
					<a className={styles.navLink()} href="#loading-states">
						Loading states
					</a>
					<a className={styles.navLink()} href="#composition">
						Frame and legend
					</a>
				</div>
				<div className={styles.navGroup()}>
					<p className={styles.navGroupLabel()}>Charts</p>
					{chartDocs.map((chart) => (
						<a
							className={styles.navLink()}
							href={`#${chart.id}`}
							key={chart.id}
						>
							{chart.name}
						</a>
					))}
				</div>
			</nav>
			<div className={styles.sidebarFooter()}>
				<a href="https://github.com/hzblj/zyplot">GitHub</a>
				<ThemeToggle />
			</div>
		</aside>

		<main className={styles.content()}>
			<section className={styles.hero()} id="getting-started">
				<p className={styles.kicker()}>Getting started</p>
				<h1>
					Beautiful charts,
					<br />
					one import away.
				</h1>
				<p>
					Zyplot gives React applications a focused chart API, strong defaults,
					accessible loading states and native light/dark theming.
				</p>
			</section>

			<section className={styles.section()} id="installation">
				<h2>Installation</h2>
				<p>
					Install the web package with the package manager your project uses.
				</p>
				<pre>
					<code>npm install @hzblj/zyplot-platform-web</code>
				</pre>
				<div className={styles.note()}>
					<strong>No stylesheet import.</strong> Zyplot includes its compiled
					styles through the JavaScript entry point. Your application does not
					need Tailwind CSS.
				</div>
			</section>

			<section className={styles.section()} id="first-chart">
				<h2>Your first chart</h2>
				<p>
					Import the single <code>Chart</code> namespace and choose a chart by
					its visual form.
				</p>
				<Example
					source={`import { Chart } from '@hzblj/zyplot-platform-web'

const series = [{
  id: 'revenue',
  label: 'Revenue',
  values: [42, 56, 51, 72, 84, 91],
}]

export function RevenueChart() {
  return (
    <Chart.Line
      categories={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
      series={series}
      format={{ prefix: '$' }}
    />
  )
}`}
				>
					<Chart.Line
						categories={categories}
						format={{ prefix: "$" }}
						height={300}
						series={[series[0] as (typeof series)[number]]}
					/>
				</Example>
			</section>

			<section className={styles.section()} id="web-package">
				<p className={styles.kicker()}>Web</p>
				<h2>Designed for React on the web</h2>
				<p>
					The web package uses ECharts for general visualization and uPlot for
					dense time series. That implementation detail stays behind one
					serializable React API.
				</p>
				<div className={styles.featureGrid()}>
					<article className={styles.feature()}>
						<span>01</span>
						<h3>Zero configuration</h3>
						<p>Production-ready color, spacing, tooltip and motion defaults.</p>
					</article>
					<article className={styles.feature()}>
						<span>02</span>
						<h3>Serializable props</h3>
						<p>
							Data-first contracts without renderer-specific option objects.
						</p>
					</article>
					<article className={styles.feature()}>
						<span>03</span>
						<h3>Stable skeletons</h3>
						<p>Every chart exposes a matching loading state at `.Skeleton`.</p>
					</article>
				</div>
			</section>

			<section className={styles.section()} id="theming">
				<h2>Theming</h2>
				<p>
					Use <code>Chart.Provider</code> for a scoped theme. Omitted values
					continue to use Zyplot defaults.
				</p>
				<pre>
					<code>{`<Chart.Provider
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
</Chart.Provider>`}</code>
				</pre>
				<h3>Provider props</h3>
				<PropsTable
					rows={[
						{
							description: "Charts rendered inside the theme scope.",
							name: "children",
							required: true,
							type: "ReactNode",
						},
						{
							defaultValue: '"inherit"',
							description: "Controls how the color mode is resolved.",
							name: "colorMode",
							type: '"inherit" | "light" | "dark" | "system"',
						},
						{
							description: "Scoped colors and typography overrides.",
							name: "theme",
							type: "ChartTheme",
						},
						{
							description: "CSS class applied to the provider scope.",
							name: "className",
							type: "string",
						},
					]}
				/>
			</section>

			<section className={styles.section()} id="dark-mode">
				<h2>Light and dark mode</h2>
				<p>
					By default charts inherit your application theme. Zyplot understands
					<code>.dark</code>, <code>data-theme="dark"</code> and the system
					color preference.
				</p>
				<pre>
					<code>{`:root {
  --zyplot-color-categorical-1: #2563eb;
  --zyplot-color-grid: #e5e7eb;
}

[data-theme='dark'] {
  --zyplot-color-categorical-1: #60a5fa;
  --zyplot-color-grid: #262626;
}`}</code>
				</pre>
				<p>
					The font is inherited from the application. Inter is not required. Set{" "}
					<code>--zyplot-font-family</code> only when charts should use a
					different stack.
				</p>
			</section>

			<section className={styles.section()} id="data-types">
				<h2>Data types</h2>
				<p>
					A series owns a stable identity, translated label and values. Pin a
					slot when filtering could otherwise repaint the surviving series.
				</p>
				<pre>
					<code>{`type ChartSeries = {
  id: string
  label: string
  values: Array<number | null>
  slot?: number
  color?: string
}`}</code>
				</pre>
				<p>
					An explicit <code>color</code> wins over the Provider palette and CSS
					variables. Use it sparingly when a series has a fixed brand identity.
				</p>
			</section>

			<section className={styles.section()} id="loading-states">
				<h2>Loading states</h2>
				<p>
					Every chart form exposes a shape-matched skeleton. It reserves the
					final dimensions so the surrounding page does not jump when data
					arrives.
				</p>
				<pre>
					<code>{`<Chart.Line.Skeleton
  height={320}
  legendCount={2}
  xAxis={false}
  yAxis
/>`}</code>
				</pre>
				<h3>Skeleton props</h3>
				<PropsTable
					rows={[
						{
							description: "CSS class applied to the skeleton root.",
							name: "className",
							type: "string",
						},
						{
							defaultValue: "240",
							description: "Reserved height matching the final chart.",
							name: "height",
							type: "number",
						},
						{
							description: "Number of legend items whose space is reserved.",
							name: "legendCount",
							type: "number",
						},
						{
							defaultValue: "true",
							description: "Reserves placeholders for horizontal-axis labels.",
							name: "xAxis",
							type: "boolean",
						},
						{
							defaultValue: "true",
							description: "Reserves placeholders for vertical-axis labels.",
							name: "yAxis",
							type: "boolean",
						},
					]}
				/>
				<h3>Custom skeleton</h3>
				<pre>
					<code>{`<Chart.Line
  isLoading
  skeleton={<MyChartSkeleton />}
  axes={{ x: false, y: true }}
  categories={categories}
  series={series}
/>`}</code>
				</pre>
			</section>

			<section className={styles.section()} id="composition">
				<h2>Frame and legend</h2>
				<p>
					<code>Chart.Frame</code> supplies the optional title, description,
					actions and source treatment around any chart. Charts manage their own
					legend automatically; <code>Chart.Legend</code> is available for
					custom composition.
				</p>
				<pre>
					<code>{`<Chart.Frame
  title="Revenue"
  description="Monthly recurring revenue"
  caption="Source: billing ledger"
>
  <Chart.Line categories={categories} series={series} />
</Chart.Frame>`}</code>
				</pre>
				<h3>Frame props</h3>
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
				<h3>Legend props</h3>
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

			<div className={styles.sectionDivider()}>
				<span>Web charts</span>
				<strong>{chartDocs.length} forms</strong>
			</div>

			{chartDocs.map((chart) => (
				<ChartSection chart={chart} key={chart.id} />
			))}
		</main>

		<aside className={styles.toc()}>
			<p className={styles.tocLabel()}>On this page</p>
			<nav aria-label="On this page" className={styles.tocNav()}>
				<a href="#getting-started">Getting started</a>
				<a href="#installation">Installation</a>
				<a href="#first-chart">First chart</a>
				<a href="#web-package">Web package</a>
				<a href="#theming">Theming</a>
				<a href="#dark-mode">Light and dark</a>
				<a href="#data-types">Data types</a>
				<a href="#loading-states">Loading states</a>
				<a href="#composition">Frame and legend</a>
				<span>Chart reference</span>
				{chartDocs.map((chart) => (
					<a href={`#${chart.id}-props`} key={chart.id}>
						{chart.name} props
					</a>
				))}
			</nav>
		</aside>
	</div>
);
