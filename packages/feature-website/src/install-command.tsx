'use client'

import {useState} from 'react'
import {CheckIcon, CopyIcon} from './icons'
import {INSTALL_COMMANDS, PACKAGE_MANAGERS, type PackageManager} from './install-commands'
import {marketingStyles} from './marketing-styles'
import {cn} from './utils'

const styles = marketingStyles()

export const InstallCommand = () => {
  const [manager, setManager] = useState<PackageManager>('yarn')
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMANDS[manager])
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className={styles.install()}>
      <div aria-label="Package manager" className={styles.installTabs()} role="tablist">
        {PACKAGE_MANAGERS.map(value => (
          <button
            aria-selected={manager === value}
            className={cn(
              styles.installTab(),
              manager === value ? styles.installTabActive() : styles.installTabInactive()
            )}
            key={value}
            onClick={() => setManager(value)}
            role="tab"
            type="button"
          >
            {value}
          </button>
        ))}
      </div>
      <div className={styles.installRow()}>
        <code className={styles.installCommand()}>{INSTALL_COMMANDS[manager]}</code>
        <button
          aria-label={copied ? 'Copied' : 'Copy install command'}
          className={styles.installCopy()}
          data-analytics="install_copy"
          data-analytics-package-manager={manager}
          data-analytics-placement="hero"
          onClick={copy}
          type="button"
        >
          {copied ? (
            <CheckIcon className={styles.installCopyIcon()} />
          ) : (
            <CopyIcon className={styles.installCopyIcon()} />
          )}
        </button>
      </div>
    </div>
  )
}
