"use client";

import { type ReactNode, useMemo } from "react";
import { docsStyles } from "../../docs-styles";
import { cn } from "../../utils";
import { chartImplementations, sourceUrl } from "../chart-implementations";
import {
	CHARTS_VERSION,
	type DocsPreferences,
	PLATFORM_COOKIE,
	VIEW_COOKIE,
} from "../preferences";
import type { ChartPlatform } from "../types";
import { usePreference } from "../use-preference";

const styles = docsStyles();

const VIEWS = ["preview", "code"] as const;
const WEB_ONLY = ["web"] as const satisfies readonly ChartPlatform[];

const LABELS: Record<ChartPlatform, string> = {
	android: "Android",
	ios: "iOS",
	web: "Web",
};

/**
 * One preview box: the chart, its source, and what it looks like elsewhere.
 *
 * Web renders live — it is the platform the docs are being read on, and a
 * screenshot of a chart the browser could draw would be a downgrade. iOS and
 * Android cannot render here, so those tabs show captures taken from the
 * example app on a real simulator and emulator by
 * `apps/example/scripts/capture-charts.sh`.
 *
 * The Preview/Code switch is independent of the platform switch: the code is
 * the same on all three, which is the point being made.
 */
export const Example = ({
	children,
	chartId,
	platforms,
	preferences,
	source,
}: {
	children: ReactNode;
	/** Enables the platform switch. Omit for examples with no captures. */
	chartId?: string;
	platforms?: readonly ChartPlatform[];
	/** Resolved from the request cookies, so the first paint is already right. */
	preferences: DocsPreferences;
	source: string;
}) => {
	const available = useMemo(
		() => (chartId ? (platforms ?? []) : []),
		[chartId, platforms],
	);
	// Both choices persist across pages: re-picking "Code" on every chart you
	// open is the kind of small friction that makes docs tiring to read.
	const [tab, setTab] = usePreference<"code" | "preview">(
		preferences.view,
		VIEW_COOKIE,
		VIEWS,
	);
	const [platform, setPlatform] = usePreference<ChartPlatform>(
		preferences.platform,
		PLATFORM_COOKIE,
		available.length > 0 ? available : WEB_ONLY,
	);

	const implementation = chartId
		? chartImplementations[chartId]?.[platform]
		: undefined;

	return (
		<div className={styles.example()}>
			<div className={styles.exampleBar()}>
				<div aria-label="Example view" className={styles.tabs()} role="tablist">
					{(["preview", "code"] as const).map((value) => (
						<button
							aria-selected={tab === value}
							className={cn(
								styles.tab(),
								tab === value ? styles.tabActive() : styles.tabInactive(),
							)}
							key={value}
							onClick={() => setTab(value)}
							role="tab"
							type="button"
						>
							{value === "preview" ? "Preview" : "Code"}
						</button>
					))}
				</div>
				{available.length > 1 ? (
					<div aria-label="Platform" className={styles.tabs()} role="tablist">
						{available.map((value) => (
							<button
								aria-selected={platform === value}
								className={cn(
									styles.tab(),
									platform === value
										? styles.tabActive()
										: styles.tabInactive(),
								)}
								key={value}
								onClick={() => setPlatform(value)}
								role="tab"
								type="button"
							>
								{LABELS[value]}
							</button>
						))}
					</div>
				) : (
					<span>Web</span>
				)}
			</div>

			{tab === "code" ? (
				<pre className={styles.exampleCode()}>
					<code>{source}</code>
				</pre>
			) : platform === "web" || !chartId ? (
				<div className={styles.examplePreview()}>{children}</div>
			) : (
				<div className={styles.galleryStage()}>
					{/*
					 * Swapped by the same `.dark` class that drives the stage colour
					 * rather than by `prefers-color-scheme`: the site has its own theme
					 * toggle, and keying the two off different signals would put a light
					 * screenshot on a dark backdrop the moment they disagreed.
					 */}
					<img
						alt={`${chartId} chart rendered on ${LABELS[platform]}`}
						className={styles.galleryImageLight()}
						loading="lazy"
						src={`/charts/${platform}/light/${chartId}.png?v=${CHARTS_VERSION}`}
					/>
					<img
						alt=""
						className={styles.galleryImageDark()}
						loading="lazy"
						src={`/charts/${platform}/dark/${chartId}.png?v=${CHARTS_VERSION}`}
					/>
				</div>
			)}

			{tab === "preview" && implementation && (
				<p className={styles.galleryMeta()}>
					{implementation.detail}
					{" · "}
					<a
						href={sourceUrl(implementation.path)}
						rel="noreferrer"
						target="_blank"
					>
						View source
					</a>
				</p>
			)}
		</div>
	);
};
