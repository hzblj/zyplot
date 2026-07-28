export type ChartCandlestickDatum = {
	category: string;
	close: number;
	high: number;
	id: string;
	low: number;
	open: number;
	timestamp?: number;
	volume?: number;
};

export type ChartCandlestickStyle = {
	candleWidth?: number;
	downColor?: string;
	hollowUp?: boolean;
	neutralColor?: string;
	upColor?: string;
	volumeDownColor?: string;
	volumeHeightRatio?: number;
	volumeUpColor?: string;
	wickWidth?: number;
};
