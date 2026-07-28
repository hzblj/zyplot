import type { FC, ReactNode } from "react";
import { Skeleton } from "../primitives";
import { cn } from "../utils";

const LABEL_WIDTHS = ["w-5", "w-6", "w-4", "w-6", "w-5", "w-6"];
const LEGEND_WIDTHS = ["w-14", "w-11", "w-16", "w-12", "w-14", "w-10", "w-13"];

const labelWidthAt = (index: number): string =>
	LABEL_WIDTHS[index % LABEL_WIDTHS.length] ?? "w-5";

const legendWidthAt = (index: number): string =>
	LEGEND_WIDTHS[index % LEGEND_WIDTHS.length] ?? "w-14";

type ChartSkeletonFrameProps = {
	children: ReactNode;
	className?: string;
	height?: number;
	legendCount?: number;
	xAxis?: boolean;
	yAxis?: boolean;
};

export const ChartSkeletonFrame: FC<ChartSkeletonFrameProps> = ({
	children,
	className,
	height = 240,
	legendCount = 0,
	xAxis = true,
	yAxis = true,
}) => (
	<div aria-hidden className={cn("flex w-full flex-col gap-3", className)}>
		{legendCount > 1 && (
			<div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
				{Array.from({ length: legendCount }, (_value, index) => (
					<div className="flex h-4.5 items-center gap-1.5" key={index}>
						<Skeleton className="size-2 shrink-0 rounded-[2px]" />
						<Skeleton className={cn("h-3", legendWidthAt(index))} />
					</div>
				))}
			</div>
		)}
		<div className="flex w-full flex-col" style={{ height }}>
			<div className="flex min-h-0 flex-1 gap-1.5">
				{yAxis && (
					<div className="flex w-6 shrink-0 flex-col items-end justify-between py-px">
						{Array.from({ length: 6 }, (_value, index) => (
							<Skeleton
								className={cn("h-2.5", labelWidthAt(index))}
								key={index}
							/>
						))}
					</div>
				)}
				<div className="min-w-0 flex-1">{children}</div>
			</div>
			{xAxis && (
				<div className="flex h-6.5 shrink-0 items-center">
					{yAxis && <div className="w-6 shrink-0" />}
					<div className="flex flex-1 justify-between pl-1.5">
						{Array.from({ length: 6 }, (_value, index) => (
							<Skeleton
								className={cn("h-2.5", labelWidthAt(index + 2))}
								key={index}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	</div>
);
