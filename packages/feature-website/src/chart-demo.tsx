"use client";

import { Chart } from "@hzblj/zyplot";
import { marketingStyles } from "./marketing-styles";

const styles = marketingStyles();

const demoSeries = [
	{
		id: "signal",
		label: "Signal",
		slot: 1,
		values: [18, 29, 24, 46, 55, 72, 68, 91],
	},
];

export const ChartDemo = () => (
	<div className={styles.chartCard()}>
		<div className={styles.chartHeader()}>
			<span>Live preview</span>
			<span className={styles.status()}>Web · ECharts</span>
		</div>
		<Chart.Line
			categories={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]}
			height={340}
			series={demoSeries}
		/>
	</div>
);
