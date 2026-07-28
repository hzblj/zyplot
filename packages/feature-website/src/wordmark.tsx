import { SymbolMark } from "./symbol-mark";
import { cn } from "./utils";

/**
 * The name, with the symbol standing in for the initial `z`.
 *
 * The mark is deliberately taller than the letters — it is the logo, not a glyph
 * substitution — and sized in `em` so it scales with whatever type size the
 * surface sets rather than needing a pixel value per placement.
 *
 * `items-baseline` rather than `items-center`: an inline SVG's baseline is its
 * bottom edge, so this sets the letters' baseline on the foot of the mark.
 * Centring the two boxes instead left the word floating visibly above it.
 *
 * The colour is `content-accent`, which is the same `#4400fc` the product leads
 * with in light mode and lifts to a lighter purple in dark, where the deep one
 * would sink into the background.
 *
 * The `z` stays in the markup for screen readers and for anyone who copies the
 * text — the mark reads as a letter, so it should be one.
 */
export const Wordmark = ({ className }: { className?: string }) => (
	<span className={cn("inline-flex items-baseline gap-[0.1em]", className)}>
		<SymbolMark className="h-[1.05em] w-auto shrink-0 text-content-accent" />
		<span>
			<span className="sr-only">z</span>yplot
		</span>
	</span>
);
