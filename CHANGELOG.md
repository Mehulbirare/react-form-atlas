# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-21

### Fixed
- Fixed internal package imports in `react-form-bridge` and `react-form-visualizer` to use package names instead of relative paths.
- Resolved TypeScript errors in onboarding schema by removing invalid null values.
- Fixed implicit any types in core engine tests.
- Renamed visualizer binary to `react-form-visualizer` (kebab-case) for better CLI compatibility.

### Added
- Root `tsconfig.json` for better monorepo type resolution.
- Premium documentation website in `docs/index.html`.

## [1.0.0] - 2026-02-15

### Added
- Initial release of React Form
- `react-form-engine` - Framework-agnostic form engine
  - State machine-based form navigation
  - Auto-save with IndexedDB/localStorage
  - Predictive validation
  - Smart progress calculation
  - Event system for tracking
- `react-form-bridge` - React integration
  - `useReactForm` hook
  - TypeScript support
- `react-form-visualizer` - Schema visualization
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

[1.0.0]: https://github.com/yourusername/React Form/releases/tag/v1.0.0


