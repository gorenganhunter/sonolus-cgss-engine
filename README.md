# Sonolus CGSS Engine

A recreation of THE iDOLM@STER CINDERELLA GIRLS STARLIGHT STAGE engine in Sonolus.

## Links

-   [Sonolus Website](https://sonolus.com)
-   [Sonolus Wiki](https://github.com/NonSpicyBurrito/sonolus-wiki)

## Installation

```
npm install sonolus-cgss-engine
```

## Documentation

### `version`

Package version.

### `databaseEngineItem`

Partial database engine item compatible with [sonolus-express](https://github.com/NonSpicyBurrito/sonolus-express).

### `csvToLevelData(chart, offset?, circleType?)`

Converts D4DJ (bangbangboom-editor) chart to Level Data.

-   `chart`: D4DJ chart.
-   `offset`: offset (default: `0`).
-   `circleType`: circle type (default: `4`)

### Assets

The following assets are exposed as package entry points:

-   `EngineConfiguration`
-   `EnginePlayData`
-   `EngineWatchData`
-   `EnginePreviewData`
-   `EngineTutorialData`
-   `EngineThumbnail`

In Node.js, you can obtain path to assets using `require.resolve('sonolus-d4dj-engine/EngineConfiguration')` or `import.meta.resolve('sonolus-d4dj-engine/EngineConfiguration')`.
