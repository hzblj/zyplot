import { ChartDemo } from "./chart-demo";
import { CoffeeMark } from "./coffee-mark";
import { GithubMark } from "./github-mark";
import { HERO_HEADLINE, HERO_LEDE } from "./hero-copy";
import { InstallCommand } from "./install-command";
import { COFFEE_URL, REPOSITORY_URL } from "./links";
import { marketingStyles } from "./marketing-styles";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { Wordmark } from "./wordmark";

const styles = marketingStyles();

/**
 * What the drawer offers on this page.
 *
 * Not the docs tree: that one is built from the chart docs, and importing them
 * here would pull every live chart preview into the landing page's bundle. Four
 * entries into the documentation is what a reader arriving at the top of the
 * site needs anyway.
 */
const menuLinks = [
	["/docs", "Docs"],
	["/docs/installation", "Installation"],
	["/docs/theming", "Theming"],
	["/docs/charts/line", "Charts"],
];

/** One line per renderer: what actually draws the marks, and what that buys. */
const platforms = [
	[
		"Web",
		"ECharts renders to canvas by default, while uPlot handles dense series with tens of thousands of points. Marks and axes stay on canvas; legends remain real, selectable HTML.",
	],
	[
		"iOS",
		"SwiftUI and Swift Charts, exposed through an Expo module. Native rendering, native gestures, zero WebViews.",
	],
	[
		"Android",
		"A single Jetpack Compose Canvas renders marks, axes, and tooltips in one native view — without building a deep tree of components.",
	],
];

export const MarketingPage = () => (
	<main>
		<nav className={styles.nav()}>
			<a className={styles.brandLink()} href="/">
				<Wordmark className={styles.wordmark()} />
			</a>
			{/*
			 * Below 820px the links fold into the drawer. They fit for a while yet at
			 * that width, but the wordmark and the toggle run into each other around
			 * 360px, and one breakpoint for the whole site's mobile nav beats two.
			 */}
			<div className={styles.navActions()}>
				<div className={styles.navLinks()}>
					<a
						className={styles.navLink()}
						data-analytics="docs_click"
						data-analytics-placement="nav"
						href="/docs"
					>
						Docs
					</a>
					<a
						className={styles.navIconLink()}
						data-analytics="github_click"
						data-analytics-placement="nav"
						href={REPOSITORY_URL}
					>
						<GithubMark className={styles.navMark()} />
						GitHub
					</a>
					<a
						className={styles.navIconLink()}
						data-analytics="coffee_click"
						data-analytics-placement="nav"
						href={COFFEE_URL}
					>
						<CoffeeMark className={styles.navMark()} />
						Buy me a coffee
					</a>
				</div>
				<ThemeToggle />
				<MobileNav>
					<nav aria-label="Site menu" className={styles.menuNav()}>
						{menuLinks.map(([href, label]) => (
							<a
								className={styles.menuLink()}
								data-analytics="docs_click"
								data-analytics-placement="drawer"
								href={href}
								key={href}
							>
								{label}
							</a>
						))}
						<a
							className={styles.menuIconLink()}
							data-analytics="github_click"
							data-analytics-placement="drawer"
							href={REPOSITORY_URL}
						>
							<GithubMark className={styles.navMark()} />
							GitHub
						</a>
						<a
							className={styles.menuIconLink()}
							data-analytics="coffee_click"
							data-analytics-placement="drawer"
							href={COFFEE_URL}
						>
							<CoffeeMark className={styles.navMark()} />
							Buy me a coffee
						</a>
					</nav>
				</MobileNav>
			</div>
		</nav>
		<section className={styles.hero()}>
			<div>
				{/*
				 * No eyebrow above the headline: it used to read "One API. Three native
				 * renderers.", which is what the headline itself now says.
				 */}
				<h1>{HERO_HEADLINE}</h1>
				<p className={styles.lede()}>{HERO_LEDE}</p>
				<div className={styles.actions()}>
					{/* Straight to installation — the intro page is one click further on. */}
					<a
						className={styles.primaryButton()}
						data-analytics="get_started"
						href="/docs/installation"
					>
						Get started
					</a>
					<InstallCommand />
				</div>
			</div>
			<ChartDemo />
		</section>
		<section className={styles.platforms()}>
			{platforms.map(([title, copy], index) => (
				<article className={styles.platform()} key={title}>
					<span className={styles.platformNumber()}>0{index + 1}</span>
					<h2>{title}</h2>
					<p>{copy}</p>
				</article>
			))}
		</section>
	</main>
);
