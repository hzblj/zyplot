export type ChartPoint = {
	x: number;
	y: number;
};

export type ChartSeries = {
	color?: string;
	data: readonly ChartPoint[];
	id: string;
	label: string;
};

export type ChartTheme = {
	axis: string;
	background: string;
	grid: string;
	text: string;
};

export type LineChartProps = {
	accessibilityLabel?: string;
	height?: number;
	series: readonly ChartSeries[];
	theme?: Partial<ChartTheme>;
};

export const defaultChartTheme: ChartTheme = {
	axis: "#64748b",
	background: "transparent",
	grid: "#e2e8f0",
	text: "#0f172a",
};
