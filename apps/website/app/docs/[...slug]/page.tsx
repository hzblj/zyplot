import {
	DocsPage,
	PLATFORM_COOKIE,
	readDocsPreferences,
	VIEW_COOKIE,
} from "@zyplot/feature-website";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
	description: "Zyplot chart guide and API reference for web, iOS and Android.",
	title: "Zyplot documentation",
};

type DocumentationPageProps = {
	params: Promise<{ slug: string[] }>;
};

/**
 * Maps a docs URL onto the page key `DocsPage` renders.
 *
 * The nested segments are the ones that need translating: `/docs/charts/bar`
 * carries the chart in the second position, and `/docs/native/ios` collapses to
 * a single flat key because every guide page lives in one document.
 */
const pageFor = (slug: string[]): string => {
	if (slug[0] === "charts") {
		return slug[1];
	}

	if (slug[0] === "web") {
		return "web-package";
	}

	if (slug[0] === "native") {
		return slug[1] ? `native-${slug[1]}` : "native-package";
	}

	return slug[0];
};

export default async function DocumentationPage({
	params,
}: DocumentationPageProps) {
	const [{ slug }, store] = await Promise.all([params, cookies()]);

	return (
		<DocsPage
			page={pageFor(slug)}
			preferences={readDocsPreferences(
				store.get(VIEW_COOKIE)?.value,
				store.get(PLATFORM_COOKIE)?.value,
			)}
		/>
	);
}
