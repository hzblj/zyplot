import type { FC } from "react";
import { formatChartNumber } from "../shared/format";

import { Typography } from "../shared/primitives";
import type { ChartNumberFormat } from "../shared/types";
import { cn } from "../shared/utils";

/**
 * One ratio against its limit, as a bar.
 *
 * Plain DOM, no canvas and no `'use client'` — a filled track needs neither, and
 * making it a chart would put a rendering engine behind two divs. It is the right
 * answer far more often than `GaugeChart` is: the same information, a tenth of
 * the space, and it stacks in a list without each row becoming a plot.
 *
 * The track is a **sequential step of the same hue** as the fill, not a grey, so
 * the pair reads as one scale rather than as figure against background.
 */

const MIN_VISIBLE_PERCENT = 1.5;

export type MeterBarProps = {
	className?: string;
	format?: ChartNumberFormat;
	label: string;
	max: number;
	/** Hides the numeric readout when the surrounding row already shows it. */
	showValue?: boolean;
	value: number;
};

export const MeterBar: FC<MeterBarProps> = ({
	className,
	format,
	label,
	max,
	showValue = true,
	value,
}) => {
	const ratio = Math.max(0, Math.min(1, value / max));
	const percent = Math.max(MIN_VISIBLE_PERCENT, ratio * 100);

	return (
		<div className={cn("flex w-full flex-col gap-1.5", className)}>
			<div className="flex items-baseline justify-between gap-3">
				<Typography color="secondary" variant="footnote">
					{label}
				</Typography>
				{showValue && (
					<Typography as="span" color="primary" variant="footnote-medium">
						<span className="tabular-nums">
							{formatChartNumber(value, format)} /{" "}
							{formatChartNumber(max, format)}
						</span>
					</Typography>
				)}
			</div>

			<div
				aria-valuemax={max}
				aria-valuemin={0}
				aria-valuenow={value}
				aria-label={label}
				className="h-2 w-full overflow-hidden rounded-full bg-chart-track"
				role="meter"
			>
				<div
					className="h-full rounded-full bg-chart-1"
					style={{ width: `${percent}%` }}
				/>
			</div>
		</div>
	);
};
