import Link from 'next/link'
import {docsStyles} from '../../docs-styles'
import type {PropRow} from '../types'

const styles = docsStyles()

const typeReferences: Record<string, string> = {
  BoxplotLabels: '/docs/data-types#specialized-data',
  ChartAnimation: '/docs/data-types#plot-style',
  ChartAnnotation: '/docs/data-types#annotations',
  ChartAxes: '/docs/data-types#chart-options',
  ChartAxisDomain: '/docs/data-types#axis-options',
  ChartAxisOptions: '/docs/data-types#axis-options',
  ChartBoxplotGroup: '/docs/data-types#specialized-data',
  ChartCandlestickDatum: '/docs/data-types#finance-data',
  ChartCandlestickLabels: '/docs/native#native-differences',
  ChartCandlestickStyle: '/docs/data-types#finance-data',
  ChartDatum: '/docs/data-types#chart-datum',
  ChartDumbbellRow: '/docs/data-types#specialized-data',
  ChartFlowLink: '/docs/data-types#specialized-data',
  ChartFlowNode: '/docs/data-types#specialized-data',
  ChartGlow: '/docs/native#native-presentation',
  ChartHalo: '/docs/native#native-presentation',
  ChartHeatmapCell: '/docs/data-types#specialized-data',
  ChartHierarchyNode: '/docs/data-types#specialized-data',
  ChartInteraction: '/docs/data-types#interaction',
  ChartInteractionEvent: '/docs/data-types#interaction',
  ChartLegendItem: '/docs/data-types#chart-legend',
  ChartNumberFormat: '/docs/data-types#chart-options',
  ChartPlotStyle: '/docs/data-types#plot-style',
  ChartProviderTheme: '/docs/theming#theme-keys',
  ChartRadarAxis: '/docs/data-types#specialized-data',
  ChartRevealAnimation: '/docs/builders#builder-reveal',
  ChartScatterSeries: '/docs/data-types#specialized-data',
  ChartScrubSelection: '/docs/hooks/use-chart-scrub',
  ChartSelectionMarker: '/docs/builders#builder-marker',
  ChartSeries: '/docs/data-types#chart-series',
  ChartSeriesStyle: '/docs/data-types#plot-style',
  ChartSurface: '/docs/theming#surface',
  ChartSurfacePadding: '/docs/theming#surface',
  ChartTheme: '/docs/theming#chart-theme',
  ChartThemeColors: '/docs/theming#chart-theme',
  ChartTimePoints: '/docs/data-types#specialized-data',
  NativeChartAnimation: '/docs/native#native-presentation',
  NativeChartAnnotation: '/docs/native#native-presentation',
  NativeChartAxisOptions: '/docs/native#native-axes',
  NativeChartInteraction: '/docs/native#native-scrubbing',
  NativeChartLineAnnotation: '/docs/builders#builder-annotation',
  NativeChartPointAnnotation: '/docs/builders#builder-annotation',
  NativeChartSeriesStyle: '/docs/native#native-presentation',
  NativeChartTheme: '/docs/theming#chart-theme',
  StyledChartSeries: '/docs/builders#builder-series',
}

const getTypeReference = (type: string) => {
  const typeName = Object.keys(typeReferences)
    .filter(name => type.includes(name))
    .sort((first, second) => second.length - first.length)[0]
  return typeName ? typeReferences[typeName] : undefined
}

export const PropsTable = ({rows}: {rows: PropRow[]}) => (
  <div className={styles.propsTableWrap()}>
    <table className={styles.propsTable()}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => {
          const typeReference = getTypeReference(row.type)

          return (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
                {row.required && <span className="ml-0.5 text-content-destructive">*</span>}
              </td>
              <td>
                {typeReference ? (
                  <Link className={styles.propsTypeLink()} href={typeReference}>
                    <code>{row.type}</code>
                  </Link>
                ) : (
                  <code>{row.type}</code>
                )}
              </td>
              <td>{row.defaultValue ? <code>{row.defaultValue}</code> : '—'}</td>
              <td>{row.description}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)
