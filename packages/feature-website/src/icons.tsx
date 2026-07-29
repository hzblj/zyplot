/**
 * The UI glyphs the site draws, in the same hairline style as the theme
 * toggle: a 16px box, no fill, `currentColor` stroke. Inline for the same reason
 * the GitHub mark is — one path each is cheaper than an icon dependency.
 */

type IconProps = { className?: string };

export const CopyIcon = ({ className }: IconProps) => (
	<svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
		<path
			d="M10.5 5.5V4A2.5 2.5 0 0 0 8 1.5H4A2.5 2.5 0 0 0 1.5 4v4A2.5 2.5 0 0 0 4 10.5h1.5"
			stroke="currentColor"
			strokeLinecap="round"
			strokeWidth={1.25}
		/>
		<rect
			height="9"
			rx="2.5"
			stroke="currentColor"
			strokeWidth={1.25}
			width="9"
			x="5.5"
			y="5.5"
		/>
	</svg>
);

export const CheckIcon = ({ className }: IconProps) => (
	<svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
		<path
			d="M3 8.5 6.5 12 13 4.5"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.5}
		/>
	</svg>
);

export const MenuIcon = ({ className }: IconProps) => (
	<svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
		<path
			d="M2.25 4.5h11.5M2.25 8h11.5M2.25 11.5h11.5"
			stroke="currentColor"
			strokeLinecap="round"
			strokeWidth={1.5}
		/>
	</svg>
);

export const CloseIcon = ({ className }: IconProps) => (
	<svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
		<path
			d="M4 4l8 8M12 4l-8 8"
			stroke="currentColor"
			strokeLinecap="round"
			strokeWidth={1.5}
		/>
	</svg>
);
