"use client";

import { useEffect } from "react";

declare global {
	interface Window {
		gtag?: (
			command: "event",
			name: string,
			params?: Record<string, string>,
		) => void;
	}
}

/**
 * One delegated click listener for every tracked control on the site.
 *
 * Marking a control is a `data-analytics="event_name"` attribute on it, and any
 * `data-analytics-*` alongside becomes a parameter. That is the whole contract,
 * and it is a data attribute rather than an `onClick` for one reason: the
 * marketing nav is a server component, so its links cannot carry a handler
 * without each one becoming a client component of its own. Delegation keeps the
 * boundary at this single component and lets a server-rendered anchor opt in.
 *
 * It also survives the thing per-link tracking does not: a control that moves,
 * or a new one, needs no wiring here.
 *
 * `gtag` is optional on purpose. Analytics loads in production only, so in
 * development and in tests every one of these calls is a no-op rather than a
 * crash — and if the script is blocked, the click still does what it was for.
 */
export const AnalyticsEvents = () => {
	useEffect(() => {
		const onClick = (event: MouseEvent) => {
			const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
				"[data-analytics]",
			);
			const name = target?.dataset.analytics;

			if (!name) {
				return;
			}

			/**
			 * `data-analytics-package-manager` arrives as `analyticsPackageManager`
			 * and goes to GA as `package_manager`, which is the casing its parameter
			 * names use.
			 */
			const params: Record<string, string> = {};

			for (const [key, value] of Object.entries(target.dataset)) {
				if (key === "analytics" || !value) {
					continue;
				}

				if (key.startsWith("analytics")) {
					params[
						key
							.slice("analytics".length)
							.replace(/^[A-Z]/, (first) => first.toLowerCase())
							.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
					] = value;
				}
			}

			window.gtag?.("event", name, params);
		};

		document.addEventListener("click", onClick);

		return () => document.removeEventListener("click", onClick);
	}, []);

	return null;
};
