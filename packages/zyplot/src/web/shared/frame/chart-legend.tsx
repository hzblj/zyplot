import type { FC } from "react";
import { Typography } from "../primitives";
import type { ChartLegendItem } from "../types";
import { cn } from "../utils";

/**
 * Identity, in HTML rather than on the canvas.
 *
 * Every chart with two or more series renders one, always — colour alone is not
 * an encoding a colour-blind reader can use, and canvas text is neither
 * selectable nor reachable by a screen reader. Keeping the legend in React is
 * also what lets its labels obey `Typography` while the marks stay in the canvas.
 */

type ChartLegendProps = {
	className?: string;
	items: ChartLegendItem[];
};

export const ChartLegend: FC<ChartLegendProps> = ({ className, items }) => (
	<ul
		className={cn(
			"flex list-none flex-wrap items-center gap-x-4 gap-y-1.5",
			className,
		)}
	>
		{items.map((item) => (
			<li className="flex items-center gap-1.5" key={item.id}>
				<span
					aria-hidden
					className="size-2 shrink-0 rounded-[2px]"
					style={{ background: item.color }}
				/>
				<Typography as="span" color="secondary" variant="footnote">
					{item.label}
				</Typography>
			</li>
		))}
	</ul>
);
