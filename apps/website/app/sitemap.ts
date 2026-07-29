import { DOCS_ROUTES } from "@zyplot/feature-website";
import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

/**
 * Every URL the site has, built from the same route list the pages read.
 *
 * A sitemap written by hand is a sitemap that lists a chart page removed two
 * releases ago, so this derives from `DOCS_ROUTES` — adding a chart adds its URL
 * here with nothing to remember.
 *
 * `lastModified` is the build time. It is honest for a site whose content ships
 * with the deploy, and it is what tells a crawler the difference between a
 * revisit and a first read.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();

	return [
		{
			changeFrequency: "monthly",
			lastModified,
			priority: 1,
			url: SITE_URL,
		},
		...DOCS_ROUTES.map((route) => ({
			changeFrequency: "monthly" as const,
			lastModified,
			/** The guides are the way in; the per-chart reference is the long tail. */
			priority: route.isGuide ? 0.8 : 0.5,
			url: `${SITE_URL}${route.href}`,
		})),
	];
}
