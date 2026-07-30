'use client'

import {useState} from 'react'
import {docsStyles} from '../../docs-styles'
import {HIGHLIGHTED_SAMPLES} from '../highlighted-samples.generated'

const styles = docsStyles()

export const CodeBlock = ({children, language = 'tsx'}: {children: string; language?: string}) => {
  const [copied, setCopied] = useState(false)
  const highlighted = HIGHLIGHTED_SAMPLES[children]

  const copy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className={styles.codeBlock()}>
      <div className={styles.codeBlockHeader()}>
        <span>{language}</span>
        <button className={styles.codeCopy()} onClick={copy} type="button">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {highlighted ? (
        <div className={styles.codeBlockBody()} dangerouslySetInnerHTML={{__html: highlighted}} />
      ) : (
        <pre className={styles.codeBlockBody()}>
          <code>{children}</code>
        </pre>
      )}
    </div>
  )
}
