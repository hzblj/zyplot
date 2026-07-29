import {
	HERO_HEADLINE,
	HERO_LEDE,
	MarketingPage,
} from "@zyplot/feature-website";
import type { Metadata } from "next";
import { REPOSITORY_URL, SITE_NAME, SITE_URL } from "./site";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
	description: HERO_LEDE,
	/** The one page whose title is the product, so it opts out of the template. */
	title: { absolute: `${SITE_NAME} — ${HERO_HEADLINE}` },
};

/**
 * What a crawler is told the page is, beyond the meta tags.
 *
 * Three nodes rather than one: `WebSite` names the site, `SoftwareApplication` is
 * what the page is actually about — a free developer library for three platforms
 * — and `SoftwareSourceCode` ties it to the repository. It is the difference
 * between a result that reads as a homepage and one that reads as a tool.
 */
const structuredData = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@id": `${SITE_URL}/#website`,
			"@type": "WebSite",
			description: HERO_LEDE,
			inLanguage: "en",
			name: SITE_NAME,
			url: SITE_URL,
		},
		{
			"@id": `${SITE_URL}/#software`,
			"@type": "SoftwareApplication",
			applicationCategory: "DeveloperApplication",
			description: HERO_LEDE,
			isAccessibleForFree: true,
			name: SITE_NAME,
			offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
			operatingSystem: "Web, iOS, Android",
			url: SITE_URL,
		},
		{
			"@id": `${SITE_URL}/#repository`,
			"@type": "SoftwareSourceCode",
			codeRepository: REPOSITORY_URL,
			name: `${SITE_NAME} source`,
			programmingLanguage: ["TypeScript", "Swift", "Kotlin"],
		},
	],
};

export default function Home() {
	return (
		<>
			{/*
			 * Inline rather than next/script: JSON-LD is data for a crawler, not a
			 * program, so it has to be in the server-rendered HTML rather than
			 * injected once the page is interactive.
			 */}
			<script
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no element form, and this is serialized from the literal above with no outside input in it
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
				type="application/ld+json"
			/>
			<MarketingPage />
		</>
	);
}
