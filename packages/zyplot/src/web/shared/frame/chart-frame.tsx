import type { FC, ReactNode } from "react";
import { Typography } from "../primitives";
import { cn } from "../utils";

/**
 * The card a chart sits in: title, optional description, an actions slot for the
 * filter row, and a caption underneath for the source or the caveat.
 *
 * Optional by design — a chart dropped straight into a dashboard grid needs no
 * card. When one is used it is the standard card recipe (hairline border, card
 * shadow, secondary surface), so a chart never invents its own container.
 */

type ChartFrameProps = {
	/** Filters and range controls. One row, above the plot. */
	actions?: ReactNode;
	/** Source, method or caveat. Below the plot, in the smallest step. */
	caption?: string;
	children: ReactNode;
	className?: string;
	description?: string;
	title?: string;
};

export const ChartFrame: FC<ChartFrameProps> = ({
	actions,
	caption,
	children,
	className,
	description,
	title,
}) => (
	<section
		className={cn(
			"flex flex-col gap-4 rounded-xl border-[0.5px] border-border-tertiary bg-surface-secondary p-4 shadow-card-default",
			className,
		)}
	>
		{(title || description || actions) && (
			<header className="flex flex-wrap items-start justify-between gap-3">
				<div className="flex flex-col gap-1">
					{title && (
						<Typography as="h3" color="primary" variant="card-title">
							{title}
						</Typography>
					)}
					{description && (
						<Typography color="secondary" variant="footnote">
							{description}
						</Typography>
					)}
				</div>
				{actions && <div className="flex items-center gap-2">{actions}</div>}
			</header>
		)}

		{children}

		{caption && (
			<Typography color="tertiary" variant="caption">
				{caption}
			</Typography>
		)}
	</section>
);
