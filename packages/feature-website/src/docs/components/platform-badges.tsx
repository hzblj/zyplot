import { docsStyles } from "../../docs-styles";
import { cn } from "../../utils";
import type { ChartPlatform } from "../types";

const styles = docsStyles();

const ALL: readonly { id: ChartPlatform; label: string }[] = [
	{ id: "web", label: "Web" },
	{ id: "ios", label: "iOS" },
	{ id: "android", label: "Android" },
];

/**
 * Every platform is always shown, supported or not — a struck-through badge
 * answers "does this run on Android?" as directly as a lit one does, where a
 * missing badge would leave the reader unsure whether it was unsupported or
 * merely undocumented.
 */
export const PlatformBadges = ({
	platforms,
}: {
	platforms: readonly ChartPlatform[];
}) => (
	<div className={styles.platformBadges()}>
		{ALL.map(({ id, label }) => {
			const isSupported = platforms.includes(id);
			return (
				<span
					className={cn(
						styles.platformBadge(),
						isSupported ? styles.platformBadgeOn() : styles.platformBadgeOff(),
					)}
					key={id}
				>
					{label}
					{/* The strike-through carries the state visually; this carries it to
					    a screen reader, which would otherwise hear only the platform. */}
					<span className="sr-only">
						{isSupported ? " supported" : " not supported"}
					</span>
				</span>
			);
		})}
	</div>
);
