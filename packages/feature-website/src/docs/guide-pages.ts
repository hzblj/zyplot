import {chartIds} from './chart-docs'

export const guidePages = [
  'introduction',
  'installation',
  'builders',
  'theming',
  ...chartIds,
  'revolut',
  'kraken',
  'family',
  'health',
  'stocks',
  'loading-states',
  'web-package',
  'composition',
  'native-package',
  'native-ios',
  'native-android',
  'use-chart-scrub',
  'use-last-reading',
  'data-types',
  'releases',
  'changelog',
]

const one = (id: string, label: string) => [{id, label}]

export const guidePageHeadings: Record<string, {id: string; label: string}[]> = {
  builders: [
    {id: 'builders', label: 'Builders'},
    {id: 'builder-list', label: 'Available builders'},
  ],
  changelog: one('changelog', 'Changelog'),
  composition: [
    {id: 'composition', label: 'Frame and legend'},
    {id: 'frame-props', label: 'Frame props'},
    {id: 'legend-props', label: 'Legend props'},
  ],
  'dark-mode': [
    {id: 'dark-mode', label: 'Light and dark mode'},
    {id: 'css-variables', label: 'CSS variables'},
  ],
  'data-types': [
    {id: 'data-types', label: 'Data types'},
    {id: 'common-data', label: 'Common data'},
    {id: 'specialized-data', label: 'Specialized data'},
    {id: 'presentation-data', label: 'Presentation'},
  ],
  family: one('family', 'Family example'),
  health: one('health', 'Health example'),
  installation: [
    {id: 'installation', label: 'Installation'},
    {id: 'entry-points', label: 'Entry points'},
  ],
  introduction: [
    {id: 'getting-started', label: 'Quick start'},
    {id: 'first-chart', label: 'First chart'},
  ],
  kraken: one('kraken', 'Kraken example'),
  'loading-states': [
    {id: 'loading-states', label: 'Loading states'},
    {id: 'custom-skeleton', label: 'Custom skeleton'},
  ],
  'native-android': [
    {id: 'native-android', label: 'Android'},
    {id: 'android-only', label: 'Android-only charts'},
  ],
  'native-ios': [
    {id: 'native-ios', label: 'iOS'},
    {id: 'ios-only', label: 'iOS-only charts'},
  ],
  'native-package': [
    {id: 'native-package', label: 'Native setup'},
    {id: 'platform-files', label: 'Platform files'},
    {id: 'native-differences', label: 'Platform differences'},
  ],
  releases: one('releases', 'Releases'),
  revolut: one('revolut', 'Revolut example'),
  stocks: one('stocks', 'Stocks example'),
  theming: [
    {id: 'theming', label: 'Theming'},
    {id: 'theme-keys', label: 'Theme keys'},
    {id: 'surface', label: 'Surface'},
    {id: 'dark-mode', label: 'Light and dark mode'},
    {id: 'css-variables', label: 'CSS variables'},
  ],
  'use-chart-scrub': [
    {id: 'use-chart-scrub', label: 'useChartScrub'},
    {id: 'scrub-result', label: 'Returned values'},
  ],
  'use-last-reading': one('use-last-reading', 'useLastReading'),
  'web-package': [
    {id: 'web-package', label: 'Web renderer'},
    {id: 'web-engines', label: 'Rendering engines'},
  ],
}
