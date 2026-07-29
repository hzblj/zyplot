import {
	DocsPage,
	docsRouteFor,
	PLATFORM_COOKIE,
	readDocsPreferences,
	VIEW_COOKIE,
} from "@zyplot/feature-website";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

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

/**
 * A title and description per page, rather than one pair for all thirty-two.
 *
 * Every documentation URL used to carry the same `<title>` and the same
 * description, which is a set of thirty-two results a search engine cannot tell
 * apart — and a link to any of them unfurled as "Zyplot documentation" with no
 * indication of which page it was.
 */
export const generateMetadata = async ({
	params,
}: DocumentationPageProps): Promise<Metadata> => {
	const { slug } = await params;
	const href = `/docs/${slug.join("/")}`;
	const route = docsRouteFor(href);

	if (!route) {
		return {};
	}

	return {
		alternates: { canonical: href },
		description: route.description,
		openGraph: {
			description: route.description,
			title: route.title,
			type: "article",
			url: href,
		},
		title: route.title,
	};
};

export default async function DocumentationPage({
	params,
}: DocumentationPageProps) {
	const [{ slug }, store] = await Promise.all([params, cookies()]);

	/**
	 * An unknown slug used to render the introduction under its own URL — a soft
	 * 404, which is worse than a real one: the crawler indexes it as a duplicate
	 * rather than dropping it.
	 */
	if (!docsRouteFor(`/docs/${slug.join("/")}`)) {
		notFound();
	}

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
