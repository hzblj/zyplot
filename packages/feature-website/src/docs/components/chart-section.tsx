import {docsStyles} from '../../docs-styles'
import type {DocsPreferences} from '../preferences'
import type {ChartDoc} from '../types'
import {Example} from './example'
import {PlatformBadges} from './platform-badges'
import {PropsTable} from './props-table'

const styles = docsStyles()

export const ChartSection = ({chart, preferences}: {chart: ChartDoc; preferences: DocsPreferences}) => (
  <section className={styles.chartDoc()} id={chart.id}>
    <div className={styles.chartIntro()}>
      <div className={styles.chartTitleRow()}>
        <div>
          <p className={styles.kicker()}>Chart</p>
          <h2>{chart.name}</h2>
        </div>
        <PlatformBadges platforms={chart.platforms} />
      </div>
      <p>{chart.description}</p>
    </div>
    <Example chartId={chart.id} platforms={chart.platforms} preferences={preferences} source={chart.code}>
      {chart.preview}
    </Example>
    <div className={styles.note()}>
      <strong>When to use</strong>
      <p>{chart.when}</p>
    </div>
    <h3 id={`${chart.id}-props`}>Props</h3>
    <p className={styles.propsIntro()}>The chart's own props first, then the shared ones this form reads.</p>
    <PropsTable rows={chart.props} />
  </section>
)
