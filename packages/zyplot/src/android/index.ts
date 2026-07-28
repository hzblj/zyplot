import { ChartProvider } from "../native/chart-provider";
import { createChart } from "../native/create-chart";
import { createSharedCharts } from "../native/shared-charts";
import type {
	ChartLollipopPropsAndroid,
	ChartPlatformPropsAndroid,
	ChartWaterfallPropsAndroid,
} from "./contracts";

export type * from "@hzblj/zyplot-core";
export type * from "./contracts";

/**
 * The Android chart namespace: the shared forms widened with the Compose
 * renderer's axis options, plus `Chart.Lollipop` and `Chart.Waterfall`, which
 * the Compose Canvas draws and Swift Charts has no equivalent for.
 *
 * Importing this commits the file to Android. Name it `*.android.tsx` and let
 * Metro pick it — see `@hzblj/zyplot/ios` for the other half.
 */
export const Chart = {
	...createSharedCharts<ChartPlatformPropsAndroid>(),
	Lollipop: createChart<ChartLollipopPropsAndroid>("lollipop"),
	Provider: ChartProvider,
	Waterfall: createChart<ChartWaterfallPropsAndroid>("waterfall"),
};
