import {
	DocsPage,
	PLATFORM_COOKIE,
	readDocsPreferences,
	VIEW_COOKIE,
} from "@zyplot/feature-website";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
	description:
		"Complete Zyplot web chart documentation, theming guide, live examples and API reference.",
	title: "Web chart documentation · Zyplot",
};

export default async function DocumentationIndex() {
	const store = await cookies();

	return (
		<DocsPage
			preferences={readDocsPreferences(
				store.get(VIEW_COOKIE)?.value,
				store.get(PLATFORM_COOKIE)?.value,
			)}
		/>
	);
}
