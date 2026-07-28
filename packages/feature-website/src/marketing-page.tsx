import { ChartDemo } from "./chart-demo";
import { GithubMark } from "./github-mark";
import { HERO_HEADLINE, HERO_LEDE } from "./hero-copy";
import { InstallCommand } from "./install-command";
import { marketingStyles } from "./marketing-styles";
import { ThemeToggle } from "./theme-toggle";
import { Wordmark } from "./wordmark";

const styles = marketingStyles();

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
			<a href="/">
				<Wordmark className={styles.wordmark()} />
			</a>
			<div className={styles.navLinks()}>
				<a href="/docs">Docs</a>
				<a
					className={styles.navGithub()}
					href="https://github.com/hzblj/zyplot"
				>
					<GithubMark className={styles.navGithubMark()} />
					GitHub
				</a>
				<ThemeToggle />
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
					<a className={styles.primaryButton()} href="/docs/installation">
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
