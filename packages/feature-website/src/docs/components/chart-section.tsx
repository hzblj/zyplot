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
    <p>{chart.when}</p>
    <h3 id={`${chart.id}-props`}>Configuration</h3>
    <p className={styles.propsIntro()}>
      Keys accepted inside <code>zyplot(z =&gt; (&#123;...&#125;))</code>. Required keys are marked with an asterisk.
    </p>
    <PropsTable rows={chart.props} />
  </section>
)
