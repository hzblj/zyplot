# Zyplot

Cross-platform React charting with a shared TypeScript contract and native
rendering on every platform:

- web: ECharts and uPlot
- iOS: Swift Charts through an Expo Module
- Android: Jetpack Compose through an Expo Module

Consumers install one package, `@hzblj/zyplot`, whatever they target. See
[`packages/zyplot/README.md`](packages/zyplot/README.md) for the public API.

## Workspace

```text
apps/example                     Expo example app
apps/website                     Marketing site and documentation
packages/zyplot                  The published library — every platform
  src/index.ts                   web entry, and the default resolution
  src/index.native.ts            the forms iOS and Android both render
  src/web                        ECharts and uPlot components
  src/native                     the shared bridge to the Expo module
  src/ios                        iOS namespace and its contracts
  src/android                    Android namespace and its contracts
  ios                            SwiftUI / Swift Charts Expo Module
  android                        Jetpack Compose Expo Module
packages/core                    Platform-neutral chart model
packages/core-tailwind-config    Shared Tailwind tokens
packages/feature-website         Marketing and docs UI
```

Both native modules register under the single name `Zyplot` and expose one view,
so the JavaScript bridge in `src/native` is shared rather than written twice.

## Development

```bash
corepack enable
yarn install
yarn dev:website
yarn dev:example
```

The example app is a development build, not Expo Go. After changing Swift or
Kotlin sources, re-run `npx expo prebuild --clean` in `apps/example` so
autolinking picks up added or removed files.

## Release

Add a changeset with `yarn changeset`. After merge to `main`, GitHub Actions
opens a version PR. Merging that PR increments all package versions together,
publishes them to npm, and creates GitHub tags/releases.
