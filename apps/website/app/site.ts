/**
 * Where the site lives, for the URLs that have to be absolute.
 *
 * Canonical tags, the sitemap and the social card are all read by something that
 * is not the browser on this page — a crawler, or a link unfurler on another
 * host — so none of them can be relative.
 *
 * Production, unconditionally, including from a deploy preview. Pointing a
 * preview's canonical at itself is how a preview host ends up in the index
 * competing with the real one; naming production is what a canonical is for.
 */
export const SITE_URL = "https://zyplot.janblazej.dev";

export const SITE_NAME = "Zyplot";

export const REPOSITORY_URL = "https://github.com/hzblj/zyplot";

/** Google Analytics 4. Loaded in production only — see the layout. */
export const GA_MEASUREMENT_ID = "G-7923X5Z3MB";
