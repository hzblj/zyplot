import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

/**
 * Everything is public, so the useful half of this file is the sitemap pointer —
 * it is how a crawler finds the thirty-odd documentation URLs that nothing on the
 * marketing page links to directly.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		host: SITE_URL,
		rules: [{ allow: "/", userAgent: "*" }],
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}
