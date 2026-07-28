import type { ChartPlatform } from "./types";

const REPO = "https://github.com/hzblj/zyplot/blob/main";

export type ChartImplementation = {
	/** What actually draws it, in the renderer's own vocabulary. */
	detail: string;
	/** Repo-relative path to the source. */
	path: string;
};

export type ChartImplementations = Partial<
	Record<ChartPlatform, ChartImplementation>
>;

export const sourceUrl = (path: string) => `${REPO}/${path}`;

const WEB = "packages/zyplot/src/web";
const IOS = "packages/zyplot/ios/Charts";
const ANDROID = "packages/zyplot/android/src/main/java/com/hzblj/zyplot/charts";

/**
 * Where each form is implemented, per platform.
 *
 * Kept as data rather than prose so the docs cannot drift into claiming a
 * renderer a chart does not have: a form missing an entry renders no link, and
 * the platform badges are driven by the same `platforms` list.
 */
export const chartImplementations: Record<string, ChartImplementations> = {
	area: {
		android: {
			detail: "drawLineOrArea on a Compose Canvas",
			path: `${ANDROID}/cartesian/CartesianCharts.kt`,
		},
		ios: {
			detail: "Swift Charts AreaMark, stacked per isStacked",
			path: `${IOS}/Marks/ZyplotMarksChart.swift`,
		},
		web: { detail: "ECharts line series with areaStyle", path: `${WEB}/area` },
	},
	bar: {
		android: {
			detail: "drawBars on a Compose Canvas",
			path: `${ANDROID}/cartesian/CartesianCharts.kt`,
		},
		ios: {
			detail: "Swift Charts BarMark",
			path: `${IOS}/Marks/ZyplotMarksChart.swift`,
		},
		web: { detail: "ECharts bar series", path: `${WEB}/bar` },
	},
	boxplot: {
		android: {
			detail: "drawBoxplot on a Compose Canvas",
			path: `${ANDROID}/specialized/SpecializedCharts.kt`,
		},
		ios: {
			detail: "Swift Charts RectangleMark and RuleMark",
			path: `${IOS}/Marks/ZyplotMarksChart.swift`,
		},
		web: { detail: "ECharts boxplot series", path: `${WEB}/boxplot` },
	},
	candlestick: {
		android: {
			detail: "drawCandlestick on a Compose Canvas",
			path: `${ANDROID}/specialized/SpecializedCharts.kt`,
		},
		ios: {
			detail: "Dedicated Swift Charts view with a volume plot",
			path: `${IOS}/Finance/ZyplotCandlestickChart.swift`,
		},
		web: { detail: "ECharts candlestick series", path: `${WEB}/candlestick` },
	},
	"diverging-bar": {
		android: {
			detail: "drawDivergingBars on a Compose Canvas",
			path: `${ANDROID}/cartesian/CartesianCharts.kt`,
		},
		ios: {
			detail: "Swift Charts BarMark around a zero baseline",
			path: `${IOS}/Marks/ZyplotMarksChart.swift`,
		},
		web: { detail: "ECharts bar series", path: `${WEB}/diverging-bar` },
	},
	dumbbell: {
		android: {
			detail: "drawDumbbell on a Compose Canvas",
			path: `${ANDROID}/specialized/SpecializedCharts.kt`,
		},
		ios: {
			detail: "Swift Charts RuleMark and PointMark",
			path: `${IOS}/Marks/ZyplotMarksChart.swift`,
		},
		web: { detail: "ECharts custom series", path: `${WEB}/dumbbell` },
	},
	funnel: {
		android: {
			detail: "drawFunnel on a Compose Canvas",
			path: `${ANDROID}/specialized/SpecializedCharts.kt`,
		},
		ios: {
			detail: "SwiftUI Canvas",
			path: `${IOS}/Specialized/ZyplotSpecializedCharts.swift`,
		},
		web: { detail: "ECharts funnel series", path: `${WEB}/funnel` },
	},
	gauge: {
		android: {
			detail: "drawGauge on a Compose Canvas",
			path: `${ANDROID}/radial/RadialCharts.kt`,
		},
		ios: {
			detail: "SwiftUI Canvas",
			path: `${IOS}/Specialized/ZyplotSpecializedCharts.swift`,
		},
		web: { detail: "ECharts gauge series", path: `${WEB}/gauge` },
	},
	heatmap: {
		android: {
			detail: "drawHeatmap on a Compose Canvas",
			path: `${ANDROID}/specialized/SpecializedCharts.kt`,
		},
		ios: {
			detail: "Swift Charts RectangleMark",
			path: `${IOS}/Marks/ZyplotMarksChart.swift`,
		},
		web: { detail: "ECharts heatmap series", path: `${WEB}/heatmap` },
	},
	histogram: {
		android: {
			detail: "drawHistogram on a Compose Canvas",
			path: `${ANDROID}/cartesian/CartesianCharts.kt`,
		},
		ios: {
			detail: "Swift Charts RectangleMark over computed bins",
			path: `${IOS}/Marks/ZyplotMarksChart.swift`,
		},
		web: {
			detail: "ECharts bar series over computed bins",
			path: `${WEB}/histogram`,
		},
	},
	line: {
		android: {
			detail: "drawLineOrArea on a Compose Canvas",
			path: `${ANDROID}/cartesian/CartesianCharts.kt`,
		},
		ios: {
			detail: "Swift Charts LineMark, one series per id",
			path: `${IOS}/Marks/ZyplotMarksChart.swift`,
		},
		web: { detail: "ECharts line series", path: `${WEB}/line` },
	},
	meter: {
		android: {
			detail: "drawGauge on a Compose Canvas",
			path: `${ANDROID}/radial/RadialCharts.kt`,
		},
		ios: {
			detail: "SwiftUI Canvas",
			path: `${IOS}/Specialized/ZyplotSpecializedCharts.swift`,
		},
		web: { detail: "DOM element, no chart engine", path: `${WEB}/meter` },
	},
	pie: {
		android: {
			detail: "drawPie on a Compose Canvas",
			path: `${ANDROID}/radial/RadialCharts.kt`,
		},
		ios: {
			detail: "Swift Charts SectorMark",
			path: `${IOS}/Marks/ZyplotMarksChart.swift`,
		},
		web: { detail: "ECharts pie series", path: `${WEB}/pie` },
	},
	radar: {
		android: {
			detail: "drawRadar on a Compose Canvas",
			path: `${ANDROID}/radial/RadialCharts.kt`,
		},
		ios: {
			detail: "SwiftUI Canvas",
			path: `${IOS}/Specialized/ZyplotSpecializedCharts.swift`,
		},
		web: { detail: "ECharts radar series", path: `${WEB}/radar` },
	},
	sankey: {
		android: {
			detail: "drawSankey on a Compose Canvas",
			path: `${ANDROID}/specialized/SpecializedCharts.kt`,
		},
		ios: {
			detail: "SwiftUI Canvas",
			path: `${IOS}/Specialized/ZyplotSpecializedCharts.swift`,
		},
		web: { detail: "ECharts sankey series", path: `${WEB}/sankey` },
	},
	scatter: {
		android: {
			detail: "drawScatter on a Compose Canvas",
			path: `${ANDROID}/cartesian/CartesianCharts.kt`,
		},
		ios: {
			detail: "Swift Charts PointMark",
			path: `${IOS}/Marks/ZyplotMarksChart.swift`,
		},
		web: { detail: "ECharts scatter series", path: `${WEB}/scatter` },
	},
	sparkline: {
		android: {
			detail: "drawSparkline on a Compose Canvas",
			path: `${ANDROID}/cartesian/CartesianCharts.kt`,
		},
		ios: {
			detail: "Swift Charts LineMark, axes and legend suppressed",
			path: `${IOS}/Marks/ZyplotMarksChart.swift`,
		},
		web: { detail: "uPlot, for dense series", path: `${WEB}/sparkline` },
	},
	"stacked-bar": {
		android: {
			detail: "drawBars with standard stacking",
			path: `${ANDROID}/cartesian/CartesianCharts.kt`,
		},
		ios: {
			detail: "Swift Charts BarMark with .standard stacking",
			path: `${IOS}/Marks/ZyplotMarksChart.swift`,
		},
		web: { detail: "ECharts stacked bar series", path: `${WEB}/stacked-bar` },
	},
	sunburst: {
		android: {
			detail: "drawSunburst on a Compose Canvas",
			path: `${ANDROID}/radial/RadialCharts.kt`,
		},
		ios: {
			detail: "SwiftUI Canvas",
			path: `${IOS}/Specialized/ZyplotSpecializedCharts.swift`,
		},
		web: { detail: "ECharts sunburst series", path: `${WEB}/sunburst` },
	},
	"time-series": {
		android: {
			detail: "drawTimeSeries on a Compose Canvas",
			path: `${ANDROID}/cartesian/CartesianCharts.kt`,
		},
		ios: {
			detail: "Swift Charts LineMark over a date axis",
			path: `${IOS}/Marks/ZyplotMarksChart.swift`,
		},
		web: { detail: "uPlot, for dense series", path: `${WEB}/time-series` },
	},
	treemap: {
		android: {
			detail: "drawTreemap on a Compose Canvas",
			path: `${ANDROID}/specialized/SpecializedCharts.kt`,
		},
		ios: {
			detail: "SwiftUI Canvas",
			path: `${IOS}/Specialized/ZyplotSpecializedCharts.swift`,
		},
		web: { detail: "ECharts treemap series", path: `${WEB}/treemap` },
	},
};
