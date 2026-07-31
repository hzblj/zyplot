import {ChartDemo} from './chart-demo'
import {CoffeeMark} from './coffee-mark'
import {GithubMark} from './github-mark'
import {HERO_HEADLINE, HERO_LEDE} from './hero-copy'
import {InstallCommand} from './install-command'
import {COFFEE_URL, REPOSITORY_URL} from './links'
import {marketingStyles} from './marketing-styles'
import {MobileNav} from './mobile-nav'
import {ThemeToggle} from './theme-toggle'
import {Wordmark} from './wordmark'

const styles = marketingStyles()

const menuLinks = [
  ['/docs', 'Docs'],
  ['/docs/installation', 'Installation'],
  ['/docs/theming', 'Theming'],
  ['/docs/charts/line', 'Charts'],
]

const platforms = [
  [
    'Web',
    'ECharts renders to canvas by default, while uPlot handles dense series with tens of thousands of points. Marks and axes stay on canvas; legends remain real, selectable HTML.',
  ],
  [
    'iOS',
    'SwiftUI and Swift Charts, exposed through an Expo module. Native rendering, native gestures, zero WebViews.',
  ],
  [
    'Android',
    'A single Jetpack Compose Canvas renders marks, axes, and tooltips in one native view — without building a deep tree of components.',
  ],
]

const examples = [
  {
    alt: 'The stock quote example screen running on the web, on Android and on iOS, side by side',
    copy: 'A headline price that tracks the scrub, a smoothed intraday line that stops where the session does, a range selector and a candlestick toggle — with native tabs and headers around all of it.',
    href: '/docs/apps/revolut',
    kicker: 'Stocks',
    slug: 'revolut',
    title: 'A quote screen that follows your finger',
  },
  {
    alt: 'The crypto price example screen running on the web, on Android and on iOS, side by side',
    copy: "Price history that runs off both edges of the window, a dotted fill closed against the latest reading, the day's extremes underneath, and a scrub that lights the line up to the finger.",
    href: '/docs/apps/kraken',
    kicker: 'Crypto',
    slug: 'kraken',
    title: 'A price trace with no axes at all',
  },
  {
    alt: 'The token price example screen running on the web, on Android and on iOS, side by side',
    copy: 'A resting wave that morphs into the window rather than a skeleton that is swapped for it, a step back that takes a beat when a finger lands, and a lit trail that holds until the rest of the trace has come back up.',
    href: '/docs/apps/family',
    kicker: 'Tokens',
    slug: 'family',
    title: 'A screen where nothing cuts',
  },
  {
    alt: 'The steps example screen running on the web, on Android and on iOS, side by side',
    copy: 'Two gridlines and no more, the daily counts written inside the plot against its trailing edge rather than in a gutter beside it, and a two-finger span that totals the days it covers.',
    href: '/docs/apps/health',
    kicker: 'Fitness',
    slug: 'health',
    title: 'A bar chart wearing its own scale',
  },
  {
    alt: 'The market quote example screen running on the web, on Android and on iOS, side by side',
    copy: 'A grid, a row of dates and a volume tape all placed off marks the chart measured and nobody drew — and a held span painted in its own direction by whoever is drawing the line.',
    href: '/docs/apps/stocks',
    kicker: 'Markets',
    slug: 'stocks',
    title: 'Chrome laid on the plot, not around it',
  },
]

export const MarketingPage = () => (
  <main>
    <nav className={styles.nav()}>
      <a className={styles.brandLink()} href="/">
        <Wordmark className={styles.wordmark()} />
      </a>
      <div className={styles.navActions()}>
        <div className={styles.navLinks()}>
          <a className={styles.navLink()} data-analytics="docs_click" data-analytics-placement="nav" href="/docs">
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
        <h1>{HERO_HEADLINE}</h1>
        <p className={styles.lede()}>{HERO_LEDE}</p>
        <div className={styles.actions()}>
          <a className={styles.primaryButton()} data-analytics="get_started" href="/docs/installation">
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
    <section className={styles.examples()} id="examples">
      <header className={styles.examplesHeader()}>
        <p className={styles.status()}>Examples</p>
        <h2>The same chart, in a whole screen</h2>
        <p className={styles.lede()}>Five studies from the example app, on all three platforms.</p>
      </header>
      <div className={styles.examplesList()}>
        {examples.map(example => (
          <article className={styles.example()} key={example.slug}>
            <div className={styles.exampleCopy()}>
              <p className={styles.status()}>{example.kicker}</p>
              <h3>{example.title}</h3>
              <p>{example.copy}</p>
              <a
                className={styles.exampleLink()}
                data-analytics="docs_click"
                data-analytics-example={example.slug}
                data-analytics-placement="examples"
                href={example.href}
              >
                See how it is built
                <span aria-hidden="true" className={styles.exampleArrow()}>
                  →
                </span>
              </a>
            </div>
            {/* Two images rather than one served by a media query: the appearance
                follows the site's own toggle, which a `prefers-color-scheme`
                source would ignore. */}
            <div className={styles.exampleShot()}>
              <img
                alt={example.alt}
                className={styles.exampleShotLight()}
                loading="lazy"
                src={`/apps/${example.slug}/light.png`}
              />
              <img alt="" className={styles.exampleShotDark()} loading="lazy" src={`/apps/${example.slug}/dark.png`} />
            </div>
          </article>
        ))}
      </div>
    </section>
  </main>
)
