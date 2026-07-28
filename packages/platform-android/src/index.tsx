import type { LineChartProps } from "@hzblj/zyplot-core";
import { requireNativeView } from "expo";
import type { ComponentType } from "react";
import type { ViewProps } from "react-native";

type NativeProps = LineChartProps & ViewProps;

const NativeLineChart: ComponentType<NativeProps> = requireNativeView(
	"ZyplotAndroid",
	"LineChart",
);

export const AndroidLineChart = ({
	height = 320,
	...props
}: LineChartProps) => (
	<NativeLineChart
		{...props}
		height={height}
		style={{ height, width: "100%" }}
	/>
);
