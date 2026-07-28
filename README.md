# Zyplot

Cross-platform React charting with a shared TypeScript contract and native rendering on every platform:

- web: uPlot
- iOS: Swift Charts through an Expo Module
- Android: Jetpack Compose through an Expo Module

## Workspace

```text
apps/example                 Expo example app
apps/website                 Marketing site and documentation
packages/zyplot              Public React API
packages/core                Platform-neutral chart model
packages/platform-web        uPlot adapter
packages/platform-ios        SwiftUI / Swift Charts Expo Module
packages/platform-android    Jetpack Compose Expo Module
```

## Development

```bash
corepack enable
yarn install
yarn dev:website
yarn dev:example
```

## Release

Add a changeset with `yarn changeset`. After merge to `main`, GitHub Actions opens a version PR. Merging that PR increments all package versions together, publishes them to npm, and creates GitHub tags/releases.

