"use client";

import { type ChartSeries, LineChart } from "@hzblj/zyplot";

const demoSeries: ChartSeries[] = [
	{
		color: "var(--color-chart-1)",
		data: [
			{ x: 0, y: 18 },
			{ x: 1, y: 29 },
			{ x: 2, y: 24 },
			{ x: 3, y: 46 },
			{ x: 4, y: 55 },
			{ x: 5, y: 72 },
			{ x: 6, y: 68 },
			{ x: 7, y: 91 },
		],
		id: "signal",
		label: "Signal",
	},
];

export const ChartDemo = () => (
	<div className="chart-card">
		<div className="chart-card__header">
			<span>Live preview</span>
			<span className="status">Web · uPlot</span>
		</div>
		<LineChart
			accessibilityLabel="Zyplot line chart preview"
			height={340}
			series={demoSeries}
		/>
	</div>
);
