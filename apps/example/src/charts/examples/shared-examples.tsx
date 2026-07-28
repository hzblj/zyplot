import { Chart } from "@hzblj/zyplot";

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

const data = [
	{ id: "web", label: "Web", value: 48 },
	{ id: "ios", label: "iOS", value: 31 },
	{ id: "android", label: "Android", value: 21 },
];

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

export const CartesianExample = ({ id }: { id: string }) => {
	switch (id) {
		case "line":
			return (
				<Chart.Line categories={categories} height={320} series={series} />
			);
		case "advanced-line":
			return (
				<Chart.Line
					animation={{ duration: 520, easing: "spring" }}
					annotations={[
						{
							axis: "y",
							color: "#f59e0b",
							dash: [6, 4],
							id: "target",
							label: "Target",
							type: "line",
							value: 75,
						},
						{
							axis: "x",
							color: "#7c3aed",
							end: "Apr",
							id: "campaign",
							label: "Campaign",
							opacity: 0.1,
							start: "Mar",
							type: "range",
						},
					]}
					categories={categories}
					height={320}
					interaction={{
						crosshair: "both",
						haptics: true,
						hover: "nearest",
						selection: "single",
						tooltip: true,
					}}
					plot={{
						backgroundColor: "#6d28d90a",
						borderColor: "#6d28d933",
						borderRadius: 12,
						borderWidth: 1,
						padding: 8,
					}}
					series={series}
					seriesStyles={{
						costs: { strokeDash: [6, 4], strokeWidth: 2 },
						revenue: { strokeWidth: 3, symbol: "circle", symbolSize: 4 },
					}}
					xAxis={{ grid: false, label: "Month" }}
					yAxis={{
						domain: { max: 100, min: 0 },
						format: { prefix: "$" },
						label: "Revenue",
						tickCount: 5,
					}}
				/>
			);
		case "area":
			return (
				<Chart.Area categories={categories} height={320} series={series} />
			);
		case "bar":
			return <Chart.Bar categories={categories} height={320} series={series} />;
		case "stacked-bar":
			return (
				<Chart.StackedBar
					categories={categories}
					height={320}
					series={series}
				/>
			);
		case "diverging-bar":
			return (
				<Chart.DivergingBar
					data={[
						{ id: "north", label: "North", value: 34 },
						{ id: "south", label: "South", value: -22 },
						{ id: "east", label: "East", value: 18 },
						{ id: "west", label: "West", value: -12 },
					]}
					height={320}
				/>
			);
		case "histogram":
			return (
				<Chart.Histogram
					height={320}
					values={[12, 14, 15, 18, 19, 22, 23, 24, 24, 26, 28, 31, 34, 38, 42]}
				/>
			);
		case "scatter":
			return (
				<Chart.Scatter
					height={320}
					series={[
						{
							id: "accounts",
							label: "Accounts",
							points: [
								{ size: 8, x: 12, y: 42 },
								{ size: 11, x: 24, y: 61 },
								{ size: 7, x: 38, y: 68 },
								{ size: 13, x: 54, y: 89 },
							],
						},
					]}
				/>
			);
		case "time-series":
			return (
				<Chart.TimeSeries
					height={320}
					points={{
						timestamps: categories.map(
							(_, index) => 1_735_689_600 + index * 86_400,
						),
						values: series.map((item) => item.values),
					}}
					series={series.map(({ values: _, ...item }) => item)}
				/>
			);
		case "sparkline":
			return <Chart.Sparkline height={160} values={series[0]?.values ?? []} />;
		default:
			return null;
	}
};

export const RadialExample = ({ id }: { id: string }) => {
	switch (id) {
		case "pie":
			return <Chart.Pie data={data} height={320} innerRadius={0.52} />;
		case "gauge":
			return <Chart.Gauge height={280} label="Adoption" value={72} />;
		case "meter":
			return (
				<Chart.Meter
					format={{ suffix: "%" }}
					height={280}
					label="Capacity"
					value={64}
				/>
			);
		case "radar":
			return (
				<Chart.Radar
					axes={[
						{ label: "Speed", max: 100 },
						{ label: "Ease", max: 100 },
						{ label: "Value", max: 100 },
						{ label: "Reach", max: 100 },
						{ label: "Quality", max: 100 },
					]}
					height={320}
					series={[
						{ id: "starter", label: "Starter", values: [72, 84, 68, 79, 64] },
						{ id: "pro", label: "Pro", values: [85, 72, 76, 66, 81] },
					]}
				/>
			);
		case "sunburst":
			return <Chart.Sunburst data={hierarchy} height={320} />;
		default:
			return null;
	}
};

export const SpecializedExample = ({ id }: { id: string }) => {
	switch (id) {
		case "boxplot":
			return (
				<Chart.Boxplot
					groups={[
						{
							id: "starter",
							label: "Starter",
							max: 92,
							median: 61,
							min: 22,
							q1: 44,
							q3: 76,
						},
						{
							id: "pro",
							label: "Pro",
							max: 98,
							median: 72,
							min: 31,
							q1: 56,
							q3: 84,
						},
					]}
					height={320}
					labels={{
						max: "Max",
						median: "Median",
						min: "Min",
						q1: "Q1",
						q3: "Q3",
					}}
				/>
			);
		case "dumbbell":
			return (
				<Chart.Dumbbell
					height={320}
					rows={[
						{ after: 72, before: 42, id: "web", label: "Web" },
						{ after: 64, before: 51, id: "ios", label: "iOS" },
						{ after: 58, before: 34, id: "android", label: "Android" },
					]}
				/>
			);
		case "funnel":
			return <Chart.Funnel data={data} height={320} />;
		case "heatmap":
			return (
				<Chart.Heatmap
					cells={Array.from({ length: 18 }, (_, index) => ({
						columnIndex: index % 6,
						rowIndex: Math.floor(index / 6),
						value: 18 + ((index * 17) % 76),
					}))}
					columns={categories}
					height={280}
					rows={["Web", "iOS", "Android"]}
				/>
			);
		case "sankey":
			return (
				<Chart.Sankey
					height={320}
					links={[
						{ source: "visits", target: "trial", value: 72 },
						{ source: "visits", target: "exit", value: 28 },
						{ source: "trial", target: "paid", value: 44 },
					]}
					nodes={[
						{ id: "visits", label: "Visits" },
						{ id: "trial", label: "Trial" },
						{ id: "exit", label: "Exit" },
						{ id: "paid", label: "Paid" },
					]}
				/>
			);
		case "treemap":
			return <Chart.Treemap data={hierarchy} height={280} />;
		case "candlestick":
		case "finance":
			return (
				<Chart.Candlestick
					animation={{ duration: 560, easing: "ease-out" }}
					annotations={[
						{
							axis: "y",
							color: "#f59e0b",
							dash: [5, 4],
							id: "alert",
							label: "Price alert",
							type: "line",
							value: 62,
						},
					]}
					data={[
						{
							category: "Mon",
							close: 48,
							high: 54,
							id: "mon",
							low: 39,
							open: 42,
							volume: 820,
						},
						{
							category: "Tue",
							close: 44,
							high: 51,
							id: "tue",
							low: 41,
							open: 48,
							volume: 620,
						},
						{
							category: "Wed",
							close: 57,
							high: 61,
							id: "wed",
							low: 43,
							open: 45,
							volume: 1_120,
						},
						{
							category: "Thu",
							close: 64,
							high: 69,
							id: "thu",
							low: 55,
							open: 58,
							volume: 980,
						},
					]}
					height={340}
					interaction={{
						crosshair: "both",
						haptics: true,
						hover: "nearest",
						selection: "single",
						tooltip: true,
						zoom: true,
					}}
					showVolume
					style={{
						candleWidth: 0.56,
						downColor: "#ef4444",
						hollowUp: true,
						upColor: "#22c55e",
						volumeHeightRatio: 0.2,
						wickWidth: 1.5,
					}}
					yAxis={{ format: { prefix: "$" }, tickCount: 6 }}
				/>
			);
		default:
			return null;
	}
};
