import {
	type ChartInteractionEvent,
	mergeChartSurface,
	type NativeChartBaseProps,
} from "@hzblj/zyplot-core";
import { requireNativeView } from "expo";
import type { ComponentType } from "react";
import type { NativeSyntheticEvent, ViewProps } from "react-native";
import { useChartContext } from "./chart-provider";

type NativeViewProps = ViewProps & {
	configuration: string;
	onInteraction?: (event: NativeSyntheticEvent<ChartInteractionEvent>) => void;
};

/**
 * Both native modules answer to `Zyplot` and expose a single view, so one
 * lookup serves iOS and Android alike. Which decoder receives the payload is
 * decided by the platform Metro resolved, not by anything here.
 */
const NativeChartView: ComponentType<NativeViewProps> =
	requireNativeView("Zyplot");

/**
 * Prop renames applied on the way to the native decoders.
 *
 * The JS contract names a chart's data by what it *is* — `data`, `series`,
 * `rows` — while Swift and Kotlin need one distinctly typed field per shape to
 * decode into. These are the few places the two disagree; everything else
 * crosses the bridge untouched.
 */
const PAYLOAD_RENAMES: Partial<Record<string, readonly [string, string]>> = {
	candlestick: ["data", "candlesticks"],
	heatmap: ["rows", "rowLabels"],
	range: ["data", "ranges"],
	rule: ["data", "rules"],
	scatter: ["series", "scatterSeries"],
	sunburst: ["data", "hierarchy"],
	treemap: ["data", "hierarchy"],
};

export const createChart = <Props extends NativeChartBaseProps>(
	type: string,
) => {
	const NativeChart = ({ height = 320, onInteraction, ...props }: Props) => {
		const inherited = useChartContext();
		const configuration: Record<string, unknown> = {
			...props,
			height,
			// The provider only supplies defaults; whatever the chart passed itself
			// has already been spread above and wins key by key.
			surface: mergeChartSurface(inherited.surface, props.surface),
			theme: props.theme ?? inherited.theme,
			type,
		};
		const rename = PAYLOAD_RENAMES[type];
		if (rename) {
			const [from, to] = rename;
			configuration[to] = configuration[from];
			delete configuration[from];
		}

		return (
			<NativeChartView
				accessibilityLabel={props.accessibilityLabel}
				configuration={JSON.stringify(configuration)}
				onInteraction={
					onInteraction
						? (event) => onInteraction(event.nativeEvent)
						: undefined
				}
				style={{ height, width: "100%" }}
			/>
		);
	};

	NativeChart.displayName = `Chart.${type}`;
	return NativeChart;
};
