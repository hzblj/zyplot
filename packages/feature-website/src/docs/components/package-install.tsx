'use client'

import {useState} from 'react'
import {docsStyles} from '../../docs-styles'
import {INSTALL_COMMANDS as commands, PACKAGE_MANAGERS, type PackageManager} from '../../install-commands'
import {cn} from '../../utils'
import {HIGHLIGHTED_SAMPLES} from '../highlighted-samples.generated'

const styles = docsStyles()

export const PackageInstall = () => {
  const [manager, setManager] = useState<PackageManager>('npm')
  const [copied, setCopied] = useState(false)
  const highlighted = HIGHLIGHTED_SAMPLES[commands[manager]]

  const copy = async () => {
    await navigator.clipboard.writeText(commands[manager])
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className={styles.codeBlock()}>
      <div className={styles.exampleBar()}>
        <div aria-label="Package manager" className={styles.tabs()} role="tablist">
          {PACKAGE_MANAGERS.map(value => (
            <button
              aria-selected={manager === value}
              className={cn(styles.tab(), manager === value && styles.tabActive())}
              key={value}
              onClick={() => setManager(value)}
              role="tab"
              type="button"
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.installRow()}>
        {highlighted ? (
          <div
            className={cn(styles.codeBlockBody(), styles.installCommand())}
            dangerouslySetInnerHTML={{__html: highlighted}}
          />
        ) : (
          <pre className={cn(styles.codeBlockBody(), styles.installCommand())}>
            <code>{commands[manager]}</code>
          </pre>
        )}
        <button
          className={cn(styles.codeCopy(), styles.installCopy())}
          data-analytics="install_copy"
          data-analytics-package-manager={manager}
          data-analytics-placement="docs"
          onClick={copy}
          type="button"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
