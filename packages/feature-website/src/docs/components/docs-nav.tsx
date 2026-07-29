"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsStyles } from "../../docs-styles";
import { cn } from "../../utils";

const styles = docsStyles();

type DocsNavProps = {
	/** Read off the chart docs themselves, so the Charts group cannot drift. */
	charts: { id: string; name: string }[];
	/**
	 * The sidebar and the drawer both render this nav, and two landmarks with the
	 * same name are indistinguishable in a screen reader's list.
	 */
	label: string;
};

/**
 * The documentation tree.
 *
 * Shared before platform-specific: Concepts describes the model every renderer
 * implements, while the Web and Native groups below are what only one of them
 * has.
 */
const groups = [
	{
		label: "Getting started",
		links: [
			["/docs", "Introduction"],
			["/docs/installation", "Installation"],
		],
	},
	{
		label: "Concepts",
		links: [
			["/docs/theming", "Theming"],
			["/docs/data-types", "Data types"],
			["/docs/loading-states", "Loading states"],
		],
	},
	{
		label: "Web",
		links: [
			["/docs/web", "Overview"],
			["/docs/dark-mode", "Light and dark mode"],
			["/docs/composition", "Frame and legend"],
		],
	},
	{
		label: "Native",
		links: [
			["/docs/native", "Overview"],
			["/docs/native/ios", "iOS"],
			["/docs/native/android", "Android"],
		],
	},
];

export const DocsNav = ({ charts, label }: DocsNavProps) => {
	const pathname = usePathname();
	/** Marks the entry for the page being read. */
	const navLinkFor = (href: string) =>
		cn(
			styles.navLink(),
			pathname === href ? styles.navLinkActive() : styles.navLinkInactive(),
		);

	return (
		<nav aria-label={label} className="grid">
			{groups.map((group) => (
				<div className={styles.navGroup()} key={group.label}>
					<p className={styles.navGroupLabel()}>{group.label}</p>
					{group.links.map(([href, text]) => (
						<Link className={navLinkFor(href)} href={href} key={href}>
							{text}
						</Link>
					))}
				</div>
			))}
			<div className={styles.navGroup()}>
				<p className={styles.navGroupLabel()}>Charts</p>
				{charts.map((chart) => (
					<Link
						className={navLinkFor(`/docs/charts/${chart.id}`)}
						href={`/docs/charts/${chart.id}`}
						key={chart.id}
					>
						{chart.name}
					</Link>
				))}
			</div>
		</nav>
	);
};
