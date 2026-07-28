/**
 * The GitHub mark, inline.
 *
 * A single path rather than an icon dependency: it is the only brand glyph the
 * site uses, and `currentColor` means it picks up the link colour in both
 * themes without a second asset for dark mode.
 */
export const GithubMark = ({ className }: { className?: string }) => (
	<svg
		aria-hidden="true"
		className={className}
		fill="currentColor"
		viewBox="0 0 16 16"
	>
		<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-2.91-.88-2.91-2.77 0-.79.28-1.44.75-1.95-.08-.2-.33-.95.07-1.98 0 0 .61-.19 2.01.75.58-.16 1.2-.24 1.82-.24.62 0 1.24.08 1.82.24 1.4-.95 2.01-.75 2.01-.75.4 1.03.15 1.78.07 1.98.47.51.75 1.16.75 1.95 0 1.9-1.13 2.57-2.92 2.77.33.29.62.85.62 1.72 0 1.03-.01 1.86-.01 2.12 0 .21.15.46.55.38A7.995 7.995 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
	</svg>
);
