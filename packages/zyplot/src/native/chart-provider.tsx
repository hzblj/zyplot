import type { ChartSurface, ChartTheme } from "@hzblj/zyplot-core";
import { createContext, type ReactNode, useContext, useMemo } from "react";

type ChartContextValue = {
	surface?: ChartSurface;
	theme?: ChartTheme;
};

const ChartContext = createContext<ChartContextValue>({});

export const useChartContext = () => useContext(ChartContext);

export type ChartProviderProps = ChartContextValue & {
	children: ReactNode;
};

/**
 * Scopes surface and theme defaults to a subtree.
 *
 * Purely a React context: the values are folded into each chart's
 * configuration before it crosses the bridge, so this costs no native code and
 * behaves the same on both platforms. Anything a chart sets itself wins, key by
 * key, so a dashboard can set one card treatment and still let a single chart
 * round its own corners.
 */
export const ChartProvider = ({
	children,
	surface,
	theme,
}: ChartProviderProps) => {
	const value = useMemo(() => ({ surface, theme }), [surface, theme]);
	return (
		<ChartContext.Provider value={value}>{children}</ChartContext.Provider>
	);
};
