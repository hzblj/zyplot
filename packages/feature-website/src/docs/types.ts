import type { ReactNode } from "react";

export type PropRow = {
	defaultValue?: string;
	description: string;
	name: string;
	required?: boolean;
	type: string;
};

export type ChartPlatform = "web" | "ios" | "android";

export type ChartDoc = {
	code: string;
	description: string;
	id: string;
	name: string;
	/**
	 * Where the form actually renders. Listing every platform a chart supports
	 * rather than only the gaps means a missing badge is a deliberate statement,
	 * not an entry someone forgot to annotate.
	 */
	platforms: readonly ChartPlatform[];
	preview: ReactNode;
	props: PropRow[];
	when: string;
};
