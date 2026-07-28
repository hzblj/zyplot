export type ChartColorMode = "dark" | "light" | "system";
export type ChartOrientation = "horizontal" | "vertical";

export type ChartAxes = {
	x?: boolean;
	y?: boolean;
};

export type ChartNumberFormat = {
	decimals?: number;
	locale?: string;
	prefix?: string;
	suffix?: string;
};

export type ChartTheme = {
	colors?: {
		axis?: string;
		background?: string;
		categorical?: readonly string[];
		grid?: string;
		label?: string;
		negative?: string;
		positive?: string;
		surface?: string;
		track?: string;
	};
	typography?: {
		fontFamily?: string;
	};
};

export const defaultChartTheme = {
	colors: {
		axis: "#71717a",
		background: "transparent",
		categorical: [
			"#6d28d9",
			"#0284c7",
			"#ea580c",
			"#16a34a",
			"#db2777",
			"#ca8a04",
			"#7c3aed",
		],
		grid: "#e4e4e7",
		label: "#71717a",
		negative: "#dc2626",
		positive: "#16a34a",
		surface: "#ffffff",
		track: "#f4f4f5",
	},
} satisfies ChartTheme;
