import { Chart } from "@hzblj/zyplot/ios";

/**
 * `Chart.Rule` and `Chart.Range` exist only in the iOS namespace, so this file
 * is `.ios.tsx` and imports `@hzblj/zyplot/ios` directly. Nothing here is
 * guarded by `Platform.OS` — Metro never bundles it anywhere else.
 */
export const PlatformExample = ({ id }: { id: string }) => {
	switch (id) {
		case "ios-rule":
			return (
				<Chart.Rule
					data={[
						{ id: "target", label: "Target", value: 72 },
						{ id: "forecast", label: "Forecast", value: 84 },
					]}
					height={280}
				/>
			);
		case "ios-range":
			return (
				<Chart.Range
					data={[
						{ category: "Jan", high: 58, id: "jan", low: 34 },
						{ category: "Feb", high: 72, id: "feb", low: 46 },
						{ category: "Mar", high: 81, id: "mar", low: 52 },
						{ category: "Apr", high: 92, id: "apr", low: 64 },
					]}
					height={300}
				/>
			);
		default:
			return null;
	}
};
