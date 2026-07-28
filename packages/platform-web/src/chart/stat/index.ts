import { StatTile as StatTileRoot } from "./stat-tile";
import { StatTileSkeleton } from "./stat-tile-skeleton";

export type { StatTileProps } from "./stat-tile";
export type { StatTileSkeletonProps } from "./stat-tile-skeleton";

/** `Chart.Stat` — the KPI tile, with its placeholder as `.Skeleton`. */
export const StatTile = Object.assign(StatTileRoot, {
	Skeleton: StatTileSkeleton,
});
