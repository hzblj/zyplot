/**
 * A coffee cup, inline, in the same solid `currentColor` style as the GitHub
 * mark it stands beside.
 *
 * Not Buy Me a Coffee's own button. Theirs is a fixed-size yellow raster image
 * served from their CDN — it would be the only external request on the page, the
 * only bitmap in a set of vector marks, and the only thing on the site that
 * ignores both themes. The README uses it, which is the right call there:
 * GitHub renders one Markdown surface and a recognisable badge earns its place.
 *
 * `evenodd` is what makes the handle a handle. Both subpaths are one shape, so
 * the inner one is subtracted rather than painted, and the hole shows whatever
 * the mark happens to sit on instead of a background colour guessed here.
 */
export const CoffeeMark = ({ className }: { className?: string }) => (
	<svg
		aria-hidden="true"
		className={className}
		fill="currentColor"
		viewBox="0 0 16 16"
	>
		<path
			clipRule="evenodd"
			d="M1.75 3.5a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 .75.75v1h.5a2.75 2.75 0 1 1 0 5.5h-.6a4 4 0 0 1-3.9 3.25h-2a4 4 0 0 1-4-4V3.5Zm9.5 2.75v3h.5a1.5 1.5 0 0 0 0-3h-.5Z"
			fillRule="evenodd"
		/>
	</svg>
);
