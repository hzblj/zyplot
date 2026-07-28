import type { LineChartProps } from "@hzblj/zyplot-core";
import { AndroidLineChart } from "@hzblj/zyplot-platform-android";
import { IosLineChart } from "@hzblj/zyplot-platform-ios";
import { Platform } from "react-native";

export type {
	ChartPoint,
	ChartSeries,
	ChartTheme,
	LineChartProps,
} from "@hzblj/zyplot-core";

export const LineChart = (props: LineChartProps) => {
	if (Platform.OS === "android") {
		return <AndroidLineChart {...props} />;
	}

	return <IosLineChart {...props} />;
};
