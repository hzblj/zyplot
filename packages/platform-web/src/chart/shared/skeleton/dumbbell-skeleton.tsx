import type { FC } from "react";
import { Skeleton } from "../primitives";
import { waveAt } from "./helpers";

export const SkeletonDumbbell: FC<{ count?: number }> = ({ count = 5 }) => (
	<div className="flex h-full w-full flex-col justify-around gap-2 py-1">
		{Array.from({ length: count }, (_value, index) => {
			const start = 6 + waveAt(index, 1.9) * 22;
			const end = start + 24 + waveAt(index, 2.6) * 34;

			return (
				<div className="relative h-2.5 w-full" key={index}>
					<Skeleton
						className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full"
						style={{ left: `${start}%`, width: `${end - start}%` }}
					/>
					<Skeleton
						className="absolute top-0 size-2.5 rounded-full"
						style={{ left: `calc(${start}% - 5px)` }}
					/>
					<Skeleton
						className="absolute top-0 size-2.5 rounded-full"
						style={{ left: `calc(${end}% - 5px)` }}
					/>
				</div>
			);
		})}
	</div>
);
