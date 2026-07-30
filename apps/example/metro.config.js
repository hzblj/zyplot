const {getDefaultConfig} = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

/**
 * ECharts and zrender pin tslib 2.3.0, whose `import` entry re-exports the UMD build as a
 * default import. That build declares `__esModule` on itself, so Metro's interop hands the
 * namespace straight back, there is no `default` on it, and every helper the charts import
 * lands as `undefined` — the web bundle then dies on its first `__extends`.
 *
 * Asserting `module` picks the same package's plain ESM build, which is what a named import
 * wanted in the first place. Only bundlers read the condition, so asserting it is safe.
 */
config.resolver.unstable_conditionNames = ['module', ...(config.resolver.unstable_conditionNames ?? [])]

module.exports = config
