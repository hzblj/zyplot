import type {
	ChartAxisOptions,
	NativeChartBaseProps,
} from "@hzblj/zyplot-core";

export type ChartAxisXIos = ChartAxisOptions & {
	scrollPosition?: number | string;
	visibleDomain?: number;
};

export type ChartAxisYIos = ChartAxisOptions & {
	plotDimensionStartPadding?: number;
	plotDimensionEndPadding?: number;
};

export type ChartPlatformPropsIos = {
	xAxis?: ChartAxisXIos;
	yAxis?: ChartAxisYIos;
};

export type ChartRuleDatumIos = {
	end?: number;
	id: string;
	label: string;
	start?: number;
	value: number;
};

export type ChartRulePropsIos = NativeChartBaseProps &
	ChartPlatformPropsIos & {
		data: readonly ChartRuleDatumIos[];
		orientation?: "horizontal" | "vertical";
	};

export type ChartRangeDatumIos = {
	category: string;
	color?: string;
	high: number;
	id: string;
	low: number;
};

export type ChartRangePropsIos = NativeChartBaseProps &
	ChartPlatformPropsIos & {
		data: readonly ChartRangeDatumIos[];
	};

export type ChartExtensionKindIos = "range" | "rule";
