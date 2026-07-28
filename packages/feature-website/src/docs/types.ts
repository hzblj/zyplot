import type { ReactNode } from "react";

export type PropRow = {
	defaultValue?: string;
	description: string;
	name: string;
	required?: boolean;
	type: string;
};

export type ChartDoc = {
	code: string;
	description: string;
	id: string;
	name: string;
	preview: ReactNode;
	props: PropRow[];
	when: string;
};
