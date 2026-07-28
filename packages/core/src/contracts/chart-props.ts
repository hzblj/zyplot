import type {
	ChartBoxplotGroup,
	ChartDatum,
	ChartDumbbellRow,
	ChartFlowLink,
	ChartFlowNode,
	ChartHeatmapCell,
	ChartHierarchyNode,
	ChartRadarAxis,
	ChartScatterSeries,
	ChartSeries,
	ChartTimePoints,
} from "./chart-data";
import type {
	ChartCandlestickDatum,
	ChartCandlestickStyle,
} from "./chart-finance";
import type { NativeChartKind } from "./chart-kinds";
import type {
	ChartAnimation,
	ChartAnnotation,
	ChartAxisOptions,
	ChartInteraction,
	ChartInteractionEvent,
	ChartPlotStyle,
	ChartSeriesStyle,
} from "./chart-presentation";
import type { ChartSurface } from "./chart-surface";
import type {
	ChartAxes,
	ChartColorMode,
	ChartNumberFormat,
	ChartOrientation,
	ChartTheme,
} from "./chart-theme";

/**
 * What every native chart accepts on top of its own data props.
 *
 * Deliberately **not** a superset of the web's `ChartBaseProps`. `texture` is
 * absent because pattern fills are a web encoding — they exist there for
 * `forced-colors` and for print, neither of which a native chart meets — and a
 * prop the renderer ignores is worse than one the compiler rejects. `className`
 * and `skeleton` are absent for the same reason: there is no DOM node to style
 * and no slot to fill.
 */
export type NativeChartBaseProps = {
	accessibilityLabel?: string;
	animation?: ChartAnimation;
	annotations?: readonly ChartAnnotation[];
	axis?: ChartAxes;
	colorMode?: ChartColorMode;
	format?: ChartNumberFormat;
	height?: number;
	interaction?: ChartInteraction;
	isLoading?: boolean;
	onInteraction?: (event: ChartInteractionEvent) => void;
	plot?: ChartPlotStyle;
	seriesStyles?: Readonly<Record<string, ChartSeriesStyle>>;
	surface?: ChartSurface;
	theme?: ChartTheme;
	xAxis?: ChartAxisOptions;
	yAxis?: ChartAxisOptions;
};

export type CartesianSeriesChartProps = NativeChartBaseProps & {
	categories: readonly string[];
	emphasisId?: string;
	series: readonly ChartSeries[];
};

export type LineChartProps = CartesianSeriesChartProps & { isSmooth?: boolean };
export type AreaChartProps = CartesianSeriesChartProps & {
	isSmooth?: boolean;
	isStacked?: boolean;
};
export type BarChartProps = CartesianSeriesChartProps & {
	orientation?: ChartOrientation;
};
export type StackedBarChartProps = BarChartProps;
export type PieChartProps = NativeChartBaseProps & {
	data: readonly ChartDatum[];
	innerRadius?: number;
};
export type GaugeChartProps = NativeChartBaseProps & {
	label?: string;
	max?: number;
	min?: number;
	value: number;
};
export type MeterChartProps = GaugeChartProps;
export type HistogramChartProps = NativeChartBaseProps & {
	binCount?: number;
	values: readonly number[];
};
export type BoxplotChartProps = NativeChartBaseProps & {
	groups: readonly ChartBoxplotGroup[];
	labels: { max: string; median: string; min: string; q1: string; q3: string };
	orientation?: ChartOrientation;
};
export type CandlestickChartProps = NativeChartBaseProps & {
	data: readonly ChartCandlestickDatum[];
	showVolume?: boolean;
	style?: ChartCandlestickStyle;
};
export type DivergingBarChartProps = NativeChartBaseProps & {
	data: readonly ChartDatum[];
};
export type DumbbellChartProps = NativeChartBaseProps & {
	rows: readonly ChartDumbbellRow[];
};
export type FunnelChartProps = NativeChartBaseProps & {
	data: readonly ChartDatum[];
};
export type HeatmapChartProps = NativeChartBaseProps & {
	cells: readonly ChartHeatmapCell[];
	columns: readonly string[];
	rows: readonly string[];
};
export type RadarChartProps = NativeChartBaseProps & {
	axes: readonly ChartRadarAxis[];
	series: readonly ChartSeries[];
};
export type ScatterChartProps = NativeChartBaseProps & {
	series: readonly ChartScatterSeries[];
	xFormat?: ChartNumberFormat;
	xLabel?: string;
	yFormat?: ChartNumberFormat;
	yLabel?: string;
};
export type SankeyChartProps = NativeChartBaseProps & {
	links: readonly ChartFlowLink[];
	nodes: readonly ChartFlowNode[];
};
export type HierarchyChartProps = NativeChartBaseProps & {
	data: readonly ChartHierarchyNode[];
};
export type TimeSeriesChartProps = NativeChartBaseProps & {
	points: ChartTimePoints;
	series: readonly Omit<ChartSeries, "values">[];
};
export type SparklineChartProps = NativeChartBaseProps & {
	color?: string;
	values: readonly (number | null)[];
};
export type NativeChartPropsByKind = {
	area: AreaChartProps;
	bar: BarChartProps;
	boxplot: BoxplotChartProps;
	candlestick: CandlestickChartProps;
	"diverging-bar": DivergingBarChartProps;
	dumbbell: DumbbellChartProps;
	funnel: FunnelChartProps;
	gauge: GaugeChartProps;
	heatmap: HeatmapChartProps;
	histogram: HistogramChartProps;
	line: LineChartProps;
	meter: MeterChartProps;
	pie: PieChartProps;
	radar: RadarChartProps;
	sankey: SankeyChartProps;
	scatter: ScatterChartProps;
	sparkline: SparklineChartProps;
	"stacked-bar": StackedBarChartProps;
	sunburst: HierarchyChartProps;
	"time-series": TimeSeriesChartProps;
	treemap: HierarchyChartProps;
};

export type NativeChartConfiguration = {
	[K in NativeChartKind]: NativeChartPropsByKind[K] & { type: K };
}[NativeChartKind];
