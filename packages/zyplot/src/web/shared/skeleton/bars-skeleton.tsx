import type { FC } from "react";
import { Skeleton } from "../primitives";
import { cn } from "../utils";
import { waveAt } from "./helpers";

type SkeletonBarsProps = {
	count?: number;
	orientation?: "horizontal" | "vertical";
	seed?: number;
};

const barHeightAt = (index: number, seed: number): number =>
	26 + Math.round(waveAt(index, seed) * 60);

export const SkeletonBars: FC<SkeletonBarsProps> = ({
	count = 8,
	orientation = "vertical",
	seed = 1.7,
}) => {
	if (orientation === "horizontal") {
		return (
			<div className="flex h-full w-full flex-col justify-around gap-2 py-1">
				{Array.from({ length: Math.min(count, 7) }, (_value, index) => (
					<Skeleton
						className="h-full max-h-7 min-h-1.5 rounded-r-sm rounded-l-none"
						key={index}
						style={{ width: `${barHeightAt(index, seed)}%` }}
					/>
				))}
			</div>
		);
	}

	return (
		<div className="flex h-full w-full items-end justify-around gap-2">
			{Array.from({ length: count }, (_value, index) => (
				<Skeleton
					className={cn("w-full max-w-7 rounded-t-sm rounded-b-none")}
					key={index}
					style={{ height: `${barHeightAt(index, seed)}%` }}
				/>
			))}
		</div>
	);
};
