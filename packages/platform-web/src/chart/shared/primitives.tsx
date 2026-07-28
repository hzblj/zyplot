import type { ComponentProps, ElementType, FC, HTMLAttributes } from "react";

import { cn } from "./utils";

type TypographyVariant =
	| "body"
	| "caption"
	| "card-title"
	| "footnote"
	| "footnote-medium"
	| "heading-m";

type TypographyColor =
	| "destructive"
	| "primary"
	| "secondary"
	| "success"
	| "tertiary";

type TypographyProps = HTMLAttributes<HTMLElement> & {
	as?: ElementType;
	color?: TypographyColor;
	variant?: TypographyVariant;
};

const variantClasses: Record<TypographyVariant, string> = {
	body: "text-body",
	caption: "text-caption",
	"card-title": "text-title",
	footnote: "text-footnote",
	"footnote-medium": "text-footnote-medium",
	"heading-m": "text-heading",
};

const colorClasses: Record<TypographyColor, string> = {
	destructive: "text-content-destructive",
	primary: "text-content-primary",
	secondary: "text-content-secondary",
	success: "text-content-success",
	tertiary: "text-content-tertiary",
};

const defaultElements: Record<TypographyVariant, ElementType> = {
	body: "p",
	caption: "span",
	"card-title": "h3",
	footnote: "p",
	"footnote-medium": "p",
	"heading-m": "h3",
};

export const Typography: FC<TypographyProps> = ({
	as,
	className,
	color = "primary",
	variant = "body",
	...props
}) => {
	const Component = as ?? defaultElements[variant];

	return (
		<Component
			className={cn(variantClasses[variant], colorClasses[color], className)}
			{...props}
		/>
	);
};

export const Skeleton = ({
	className,
	style,
	...props
}: ComponentProps<"div">) => (
	<div
		className={cn(
			"relative overflow-hidden rounded-md bg-fill-tertiary",
			className,
		)}
		style={style}
		{...props}
	>
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0 animate-pulse bg-fill-secondary"
		/>
	</div>
);

type IconProps = ComponentProps<"svg"> & {
	name: "arrow-up";
};

export const Icon = ({ name: _name, ...props }: IconProps) => (
	<svg
		aria-hidden
		fill="none"
		viewBox="0 0 16 16"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<title>Trend direction</title>
		<path
			d="M8 13V3m0 0L4 7m4-4 4 4"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
	</svg>
);
