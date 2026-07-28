"use client";

import { type FC, useMemo } from "react";
import { tv } from "tailwind-variants";
import { formatChartNumber } from "../shared/format";

import { Icon, Typography } from "../shared/primitives";
import type { ChartNumberFormat } from "../shared/types";
import { cn } from "../shared/utils";
import { Sparkline } from "../sparkline";

/**
 * A headline number with its change and, optionally, the shape behind it.
 *
 * This is the most-used "chart" on any dashboard and it is deliberately **not**
 * one: a single current value drawn as a one-bar bar chart wastes a card to say
 * something a number says better. The sparkline is there to answer "and is that
 * unusual", which the number alone cannot.
 *
 * `direction` is separate from the sign of `delta` on purpose. A falling price is
 * good news and a falling extraction rate is not, so which way is up is the
 * caller's call — the tile never guesses that a decrease is bad.
 */

/**
 * There is no `arrow-down` in the icon registry and inventing one would mean
 * inventing a glyph the registry does not carry. Rotating the registered `arrow-up`
 * is the same asset pointing the other way, which is what the design shows.
 */
const deltaIcon = tv({
	base: "size-3.5",
	defaultVariants: { isFalling: false },
	variants: { isFalling: { false: "", true: "rotate-180" } },
});

const deltaText = tv({
	base: "inline-flex items-center gap-0.5",
	defaultVariants: { tone: "neutral" },
	variants: {
		tone: {
			good: "text-content-success",
			neutral: "text-content-tertiary",
			poor: "text-content-destructive",
		},
	},
});

export type StatTileDirection = "down-is-good" | "neutral" | "up-is-good";

export type StatTileProps = {
	className?: string;
	/** Change against the comparison period, in the same unit as `value`. */
	delta?: number;
	deltaFormat?: ChartNumberFormat;
	/** Which way of moving counts as good. Defaults to neutral — no colour. */
	direction?: StatTileDirection;
	format?: ChartNumberFormat;
	label: string;
	/** What the delta is measured against. Rendered next to it. */
	since?: string;
	/** Recent history for the sparkline. Omit it and no sparkline is drawn. */
	trend?: number[];
	value: number;
};

const toneFor = (
	delta: number | undefined,
	direction: StatTileDirection,
): "good" | "neutral" | "poor" => {
	if (delta === undefined || delta === 0 || direction === "neutral") {
		return "neutral";
	}

	const isRising = delta > 0;
	if (direction === "up-is-good") {
		if (isRising) {
			return "good";
		}

		return "poor";
	}

	if (isRising) {
		return "poor";
	}

	return "good";
};

export const StatTile: FC<StatTileProps> = ({
	className,
	delta,
	deltaFormat,
	direction = "neutral",
	format,
	label,
	since,
	trend,
	value,
}) => {
	const tone = useMemo(() => toneFor(delta, direction), [delta, direction]);
	const hasDelta = delta !== undefined;

	return (
		<div
			className={cn(
				"flex flex-col gap-2 rounded-xl border-[0.5px] border-border-tertiary bg-surface-secondary p-4 shadow-card-default",
				className,
			)}
		>
			<Typography color="secondary" variant="footnote">
				{label}
			</Typography>

			<Typography as="p" color="primary" variant="heading-m">
				<span className="tabular-nums">{formatChartNumber(value, format)}</span>
			</Typography>

			{hasDelta && (
				<div className="flex items-center gap-1.5">
					<span className={deltaText({ tone })}>
						<Icon
							className={deltaIcon({ isFalling: delta < 0 })}
							name="arrow-up"
						/>
						<Typography as="span" variant="footnote-medium">
							<span className="tabular-nums">
								{formatChartNumber(Math.abs(delta), deltaFormat ?? format)}
							</span>
						</Typography>
					</span>
					{since && (
						<Typography as="span" color="tertiary" variant="footnote">
							{since}
						</Typography>
					)}
				</div>
			)}

			{trend && trend.length > 1 && (
				<Sparkline className="mt-1" values={trend} />
			)}
		</div>
	);
};
