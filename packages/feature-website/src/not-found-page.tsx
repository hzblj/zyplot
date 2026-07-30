import {CoffeeMark} from './coffee-mark'
import {GithubMark} from './github-mark'
import {COFFEE_URL, REPOSITORY_URL} from './links'
import {marketingStyles} from './marketing-styles'
import {MobileNav} from './mobile-nav'
import {notFoundStyles} from './not-found-styles'
import {ThemeToggle} from './theme-toggle'
import {Wordmark} from './wordmark'

const styles = marketingStyles()
const notFound = notFoundStyles()

const suggestions = [
  ['/docs', 'Documentation', 'The guides, from installation to the native renderers.'],
  ['/docs/charts/line', 'Chart gallery', 'All twenty-one forms, with props and a live preview each.'],
  ['/docs/installation', 'Installation', 'One package for web, iOS and Android.'],
]

export const NotFoundPage = () => (
  <main>
    <nav className={styles.nav()}>
      <a className={styles.brandLink()} href="/">
        <Wordmark className={styles.wordmark()} />
      </a>
      <div className={styles.navActions()}>
        <div className={styles.navLinks()}>
          <a className={styles.navLink()} href="/docs">
            Docs
          </a>
          <a className={styles.navIconLink()} href={REPOSITORY_URL}>
            <GithubMark className={styles.navMark()} />
            GitHub
          </a>
          <a className={styles.navIconLink()} href={COFFEE_URL}>
            <CoffeeMark className={styles.navMark()} />
            Buy me a coffee
          </a>
        </div>
        <ThemeToggle />
        <MobileNav>
          <nav aria-label="Site menu" className={styles.menuNav()}>
            <a className={styles.menuLink()} href="/docs">
              Docs
            </a>
            <a className={styles.menuIconLink()} href={REPOSITORY_URL}>
              <GithubMark className={styles.navMark()} />
              GitHub
            </a>
            <a className={styles.menuIconLink()} href={COFFEE_URL}>
              <CoffeeMark className={styles.navMark()} />
              Buy me a coffee
            </a>
          </nav>
        </MobileNav>
      </div>
    </nav>

    <section className={notFound.hero()}>
      <p className={styles.status()}>Error 404</p>
      <h1>This page does not exist.</h1>
      <p className={notFound.lede()}>
        The link may be out of date, or the page may have moved. Everything below is still where it was.
      </p>
      <div className={notFound.actions()}>
        <a className={styles.primaryButton()} href="/docs">
          Read the docs
        </a>
        <a className={notFound.secondaryLink()} href="/">
          Back to home
        </a>
      </div>

      <div className={notFound.suggestions()}>
        {suggestions.map(([href, title, copy]) => (
          <a className={notFound.suggestion()} href={href} key={href}>
            <span className={notFound.suggestionTitle()}>{title}</span>
            <span className={notFound.suggestionCopy()}>{copy}</span>
          </a>
        ))}
      </div>
    </section>
  </main>
)
