import { ChartProvider } from "../native/chart-provider";
import { createChart } from "../native/create-chart";
import { createSharedCharts } from "../native/shared-charts";
import type {
	ChartPlatformPropsIos,
	ChartRangePropsIos,
	ChartRulePropsIos,
} from "./contracts";

export type * from "@hzblj/zyplot-core";
export type * from "./contracts";

/**
 * The iOS chart namespace: the shared forms widened with Swift Charts' axis
 * options, plus the two forms `Chart.Range` and `Chart.Rule` that only
 * `RectangleMark` and `RuleMark` provide.
 *
 * Importing this commits the file to iOS. Name it `*.ios.tsx` and let Metro
 * pick it — see `@hzblj/zyplot/android` for the other half.
 */
export const Chart = {
	...createSharedCharts<ChartPlatformPropsIos>(),
	Provider: ChartProvider,
	Range: createChart<ChartRangePropsIos>("range"),
	Rule: createChart<ChartRulePropsIos>("rule"),
};
