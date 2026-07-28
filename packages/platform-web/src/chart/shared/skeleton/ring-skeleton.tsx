import type { FC } from "react";
import { Skeleton } from "../primitives";

type SkeletonRingProps = {
	holeRatio?: number;
	sizePercent?: number;
};

export const SkeletonRing: FC<SkeletonRingProps> = ({
	holeRatio = 0.71,
	sizePercent = 82,
}) => {
	const stop = `${(holeRatio * 100).toFixed(1)}%`;
	const maskImage = `radial-gradient(circle farthest-side at center, transparent ${stop}, #000 ${stop})`;

	return (
		<div className="flex h-full w-full items-center justify-center">
			<div
				className="relative aspect-square"
				style={{ height: `${sizePercent}%` }}
			>
				<Skeleton className="size-full rounded-full" style={{ maskImage }} />
			</div>
		</div>
	);
};
