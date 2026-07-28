import type { ChartNumberFormat } from "./chart-theme";

export type ChartAxisScale = "auto" | "category" | "linear" | "log" | "time";
export type ChartAxisPosition = "end" | "start";

export type ChartAxisDomain = {
	max?: number;
	min?: number;
};

/**
 * Detailed axis configuration. `axis={{ x: false }}` remains the short form for
 * visibility; use `xAxis` and `yAxis` when the chart needs a finance-grade scale.
 */
export type ChartAxisOptions = {
	domain?: ChartAxisDomain;
	format?: ChartNumberFormat;
	grid?: boolean;
	gridDash?: readonly number[];
	label?: string;
	labelRotation?: number;
	position?: ChartAxisPosition;
	reversed?: boolean;
	scale?: ChartAxisScale;
	tickCount?: number;
	tickValues?: readonly (number | string)[];
	visible?: boolean;
};

export type ChartPlotPadding = {
	bottom?: number;
	left?: number;
	right?: number;
	top?: number;
};

export type ChartPlotStyle = {
	backgroundColor?: string;
	borderColor?: string;
	borderRadius?: number;
	borderWidth?: number;
	clip?: boolean;
	padding?: number | ChartPlotPadding;
};

export type ChartSymbol = "circle" | "diamond" | "none" | "square" | "triangle";

export type ChartSeriesStyle = {
	color?: string;
	fillOpacity?: number;
	opacity?: number;
	strokeDash?: readonly number[];
	strokeWidth?: number;
	symbol?: ChartSymbol;
	symbolSize?: number;
};

export type ChartAnimationEasing =
	| "ease-in"
	| "ease-in-out"
	| "ease-out"
	| "linear"
	| "spring";

export type ChartAnimation = {
	delay?: number;
	duration?: number;
	easing?: ChartAnimationEasing;
	enabled?: boolean;
	initial?: boolean;
	updates?: boolean;
};

export type ChartCrosshairMode = "both" | "none" | "x" | "y";
export type ChartHoverMode = "axis" | "nearest" | "none" | "series";
export type ChartSelectionMode = "multiple" | "none" | "single";

export type ChartInteraction = {
	crosshair?: ChartCrosshairMode;
	dimOpacity?: number;
	haptics?: boolean;
	highlightScale?: number;
	hover?: ChartHoverMode;
	pan?: boolean;
	selection?: ChartSelectionMode;
	tooltip?: boolean;
	zoom?: boolean;
};

export type ChartCoordinate = number | string;

export type ChartLineAnnotation = {
	axis: "x" | "y";
	color?: string;
	dash?: readonly number[];
	id: string;
	label?: string;
	type: "line";
	value: ChartCoordinate;
};

export type ChartRangeAnnotation = {
	axis: "x" | "y";
	color?: string;
	end: ChartCoordinate;
	id: string;
	label?: string;
	opacity?: number;
	start: ChartCoordinate;
	type: "range";
};

export type ChartPointAnnotation = {
	color?: string;
	id: string;
	label?: string;
	symbol?: ChartSymbol;
	type: "point";
	x: ChartCoordinate;
	y: number;
};

export type ChartTextAnnotation = {
	color?: string;
	id: string;
	text: string;
	type: "text";
	x?: ChartCoordinate;
	y?: number;
};

export type ChartAnnotation =
	| ChartLineAnnotation
	| ChartPointAnnotation
	| ChartRangeAnnotation
	| ChartTextAnnotation;

export type ChartInteractionEvent = {
	category?: string;
	nativeX?: number;
	nativeY?: number;
	seriesId?: string;
	timestamp?: number;
	value?: number;
	x?: number;
	y?: number;
};
