import type { ChartPlatform } from "./types";

/**
 * Bump whenever `apps/example/scripts/capture-charts.sh` is re-run.
 *
 * The captures keep their paths, so a browser that has seen a chart once will
 * happily serve the previous one forever. The query string is what forces the
 * refetch — without it a re-capture is invisible to anyone who already loaded
 * the page.
 */
export const CHARTS_VERSION = "4";

export const VIEW_COOKIE = "zyplot-docs-view";
export const PLATFORM_COOKIE = "zyplot-docs-platform";

export type DocsView = "code" | "preview";

export type DocsPreferences = {
	platform: ChartPlatform;
	view: DocsView;
};

export const DEFAULT_PREFERENCES: DocsPreferences = {
	platform: "web",
	view: "preview",
};

const VIEWS: readonly string[] = ["code", "preview"];
const PLATFORMS: readonly string[] = ["android", "ios", "web"];

/**
 * Narrows two raw cookie values into preferences.
 *
 * Cookies arrive with the request, so the server can resolve these before it
 * renders and the first paint already shows the tab the reader last chose —
 * no effect, no flash of the default. Anything unrecognised falls back rather
 * than throwing: a cookie is user-editable input, not trusted state.
 */
export const readDocsPreferences = (
	view: string | undefined,
	platform: string | undefined,
): DocsPreferences => ({
	platform: PLATFORMS.includes(platform ?? "")
		? (platform as ChartPlatform)
		: DEFAULT_PREFERENCES.platform,
	view: VIEWS.includes(view ?? "")
		? (view as DocsView)
		: DEFAULT_PREFERENCES.view,
});
