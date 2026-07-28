export type * from "@hzblj/zyplot-core";

import { ChartProvider } from "./native/chart-provider";
import { createSharedCharts } from "./native/shared-charts";

export type { ChartProviderProps } from "./native/chart-provider";

/**
 * The cross-platform chart namespace.
 *
 * Every form reachable here renders on iOS and Android, so what type-checks
 * runs. Forms only one renderer implements are deliberately absent: reach them
 * through `@hzblj/zyplot/ios` or `@hzblj/zyplot/android` from a `.ios.tsx` /
 * `.android.tsx` file, which is also where the platform axis options live.
 */
export const Chart = {
	...createSharedCharts(),
	Provider: ChartProvider,
};
