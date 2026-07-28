import type { FC } from "react";
import { Skeleton } from "../primitives";
import { cn } from "../utils";

export const SkeletonBlocks: FC<{ count?: number }> = ({ count = 5 }) => (
	<div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-1.5">
		{Array.from({ length: count }, (_value, index) => (
			<Skeleton
				className={cn("size-full rounded-sm", index === 0 && "row-span-2")}
				key={index}
				style={{ opacity: 0.4 + index * 0.1 }}
			/>
		))}
	</div>
);
