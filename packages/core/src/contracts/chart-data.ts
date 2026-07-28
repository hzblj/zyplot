export type ChartSeries = {
	color?: string;
	id: string;
	label: string;
	slot?: number;
	values: readonly (number | null)[];
};

export type ChartDatum = {
	color?: string;
	id: string;
	label: string;
	slot?: number;
	value: number;
};

export type ChartScatterPoint = {
	label?: string;
	size?: number;
	x: number;
	y: number;
};

export type ChartScatterSeries = {
	color?: string;
	id: string;
	label: string;
	points: readonly ChartScatterPoint[];
	slot?: number;
};

export type ChartHeatmapCell = {
	columnIndex: number;
	rowIndex: number;
	value: number | null;
};

export type ChartDumbbellRow = {
	after: number;
	before: number;
	id: string;
	label: string;
};

export type ChartBoxplotGroup = {
	id: string;
	label: string;
	max: number;
	median: number;
	min: number;
	outliers?: readonly number[];
	q1: number;
	q3: number;
};

export type ChartHierarchyNode = {
	children?: readonly ChartHierarchyNode[];
	color?: string;
	id: string;
	label: string;
	slot?: number;
	value?: number;
};

export type ChartFlowLink = {
	source: string;
	target: string;
	value: number;
};

export type ChartFlowNode = {
	color?: string;
	id: string;
	label: string;
	slot?: number;
};

export type ChartRadarAxis = {
	label: string;
	max: number;
};

export type ChartTimePoints = {
	timestamps: readonly number[];
	values: readonly (readonly (number | null)[])[];
};
