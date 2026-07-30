const {getDefaultConfig} = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

config.resolver.unstable_conditionNames = ['module', ...(config.resolver.unstable_conditionNames ?? [])]

module.exports = config
