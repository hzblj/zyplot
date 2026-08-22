---
"@hzblj/zyplot": patch
---

Build the Android module with `expo-module-gradle-plugin` instead of the legacy `ExpoModulesCorePlugin.gradle` helpers, so it stops crashing on startup under Expo SDK 57 with `UnsupportedOperationException: This function has a reified type parameter`. From SDK 57 on, the Compose `View` and `Prop` definitions inline calls into the Pika compiler plugin, which only the module plugin applies; compiled without it, those calls survive as stubs that throw the moment the module registers. The Compose compiler now also follows the host project's Kotlin version rather than a pinned one. Thanks [@divineniiquaye](https://github.com/divineniiquaye) for the report and the diagnosis.
