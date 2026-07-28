import type {
	ChartAxisOptions,
	ChartDatum,
	NativeChartBaseProps,
} from "@hzblj/zyplot-core";

export type ChartAxisXAndroid = ChartAxisOptions & {
	labelOverflow?: "clip" | "ellipsis" | "visible";
};

export type ChartAxisYAndroid = ChartAxisOptions & {
	labelOverflow?: "clip" | "ellipsis" | "visible";
};

export type ChartPlatformPropsAndroid = {
	xAxis?: ChartAxisXAndroid;
	yAxis?: ChartAxisYAndroid;
};

export type ChartWaterfallDatumAndroid = {
	id: string;
	label: string;
	value: number;
};

export type ChartWaterfallPropsAndroid = NativeChartBaseProps &
	ChartPlatformPropsAndroid & {
		data: readonly ChartWaterfallDatumAndroid[];
	};

export type ChartLollipopPropsAndroid = NativeChartBaseProps &
	ChartPlatformPropsAndroid & {
		data: readonly ChartDatum[];
		orientation?: "horizontal" | "vertical";
	};

export type ChartExtensionKindAndroid = "lollipop" | "waterfall";
