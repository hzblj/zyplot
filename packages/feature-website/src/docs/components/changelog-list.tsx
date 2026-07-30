import {docsStyles} from '../../docs-styles'
import {REPOSITORY_URL} from '../../links'
import {CHANGELOG} from '../changelog.generated'

const styles = docsStyles()

/** The GitHub release for a version. The tag is scoped, so the `@`s are encoded. */
const releaseHref = (version: string) => `${REPOSITORY_URL}/releases/tag/%40hzblj/zyplot%40${version}`

/**
 * Release notes carry one inline mark, and it is always a type or a prop name.
 * Splitting on the backticks is the whole of the markdown a changeset needs here.
 */
const withCode = (text: string) =>
  text.split('`').map((part, index) => (index % 2 === 0 ? part : <code key={`${index}-${part}`}>{part}</code>))

export const ChangelogList = () => (
  <div className={styles.changelogList()}>
    {CHANGELOG.map(release => (
      <section className={styles.changelogRelease()} key={release.version}>
        <div className={styles.changelogVersionRow()}>
          <a className={styles.changelogVersion()} href={releaseHref(release.version)}>
            {release.version}
          </a>
          {release.groups.map(group => (
            <span className={styles.changelogTag()} key={group.label}>
              {group.label.replace(' Changes', '')}
            </span>
          ))}
        </div>
        <div className={styles.changelogEntries()}>
          {release.groups.flatMap(group =>
            group.entries.map(entry => (
              <div className={styles.changelogEntry()} key={entry.commit?.sha ?? entry.paragraphs[0]}>
                {entry.paragraphs.map(paragraph => (
                  <p className={styles.changelogParagraph()} key={paragraph}>
                    {withCode(paragraph)}
                  </p>
                ))}
                {entry.commit && (
                  <a className={styles.changelogCommit()} href={entry.commit.href}>
                    {entry.commit.sha}
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    ))}
  </div>
)
