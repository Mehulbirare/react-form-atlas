# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.2] - 2026-06-13

### Security
- **Visualizer (XSS):** `SchemaVisualizer.toHTML` and the `react-form-atlas-visualizer` CLI now HTML-escape all schema-derived values (schema id, initial state, state ids, event labels and transition targets) before embedding them in the generated page. Previously a crafted schema (e.g. a state id containing `</pre><script>…`) could inject and execute arbitrary HTML/JavaScript in the generated visualization.
- Applied non-breaking `npm audit fix` updates for transitive dev-dependency advisories. (Remaining advisories are confined to dev tooling — `tsup`/`esbuild`/`vitest`/`eslint` — and are not shipped in the published packages, which contain only `dist`.)

### Fixed
- **Core:** `FormEngine.back()` removed the wrong entry from `completedSteps` (it deleted the state being left rather than the state being returned to). As a result progress never decreased when navigating backwards and completed-step tracking went stale. The returned-to step is now correctly un-completed.
- **React:** `useReactForm` captured `onStepChange` / `onComplete` / `onError` callbacks on first render only, so updated callbacks were never invoked (stale closure). Callbacks are now read from a ref and `isReady` is reset while a new schema initializes.

### Changed
- Aligned all package versions to `1.3.2` (the `react-form-atlas` React package had drifted to `1.3.0`) and bumped internal `react-form-atlas-engine` dependency ranges accordingly.

## [1.3.0] - 2026-02-21

### Changed
- Minor architectural refinements for performance.
- Enhanced stability for core event listeners.

## [1.2.0] - 2026-02-21

### Added
- Integrated full documentation (`getting-started`, `core-concepts`, `api-reference`) into the premium `index.html` homepage.
- Updated repository homepage to GitHub Pages URL.

## [1.1.0] - 2026-02-21

### Fixed
- Fixed internal package imports in `react-form-atlas` and `react-form-atlas-visualizer` to use package names instead of relative paths.
- Resolved TypeScript errors in onboarding schema by removing invalid null values.
- Fixed implicit any types in core engine tests.
- Renamed visualizer binary to `react-form-atlas-visualizer` (kebab-case) for better CLI compatibility.

### Added
- Root `tsconfig.json` for better monorepo type resolution.
- Premium documentation website in `docs/index.html`.

## [1.0.0] - 2026-02-15

### Added
- Initial release of React Form Atlas
- `react-form-atlas-engine` - Framework-agnostic form engine
  - State machine-based form navigation
  - Auto-save with IndexedDB/localStorage
  - Predictive validation
  - Smart progress calculation
  - Event system for tracking
- `react-form-atlas` - React integration
  - `useReactForm` hook
  - TypeScript support
- `react-form-atlas-visualizer` - Schema visualization
  - CLI tool for generating flowcharts
  - Mermaid diagram generation
  - Interactive HTML output
- Comprehensive documentation
- Example implementations
- Full TypeScript support

### Features
- **Dynamic Pathing**: Graph-based navigation that adapts to user input
- **Draft-Lock**: Automatic state persistence across sessions
- **Predictive Validation**: Early detection of impossible paths
- **Weighted Progress**: Smart progress calculation based on path weight
- **Accessibility**: Built-in ARIA labels and keyboard navigation
- **Analytics Ready**: Hooks for tracking user behavior

[1.3.2]: https://github.com/Mehulbirare/react-form-atlas/releases/tag/v1.3.2
[1.2.0]: https://github.com/Mehulbirare/react-form-atlas/releases/tag/v1.2.0
[1.1.0]: https://github.com/Mehulbirare/react-form-atlas/releases/tag/v1.1.0
[1.0.0]: https://github.com/Mehulbirare/react-form-atlas/releases/tag/v1.0.0


