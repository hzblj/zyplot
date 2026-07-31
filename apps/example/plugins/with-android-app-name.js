const {AndroidConfig, withStringsXml} = require('expo/config-plugins')

// Sets the Android launcher label. It can't just come from `expo.name`, because that name also becomes
// the iOS Xcode target, and a target named Zyplot shadows the Zyplot pod that @hzblj/zyplot installs —
// `ExpoModulesProvider.swift` then imports the app instead of the library and loses ZyplotModule.
module.exports = (config, appName) =>
  withStringsXml(config, config => {
    config.modResults = AndroidConfig.Strings.setStringItem([{_: appName, $: {name: 'app_name'}}], config.modResults)

    return config
  })
