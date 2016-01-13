# Change log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [0.2.0] - 2016-01-13

### Changed
- **API BREAK** Remove 4th arg of `filterRows` and always returns an array.

### Added
- Add `filterRow` that returns an object and throws an error if multiple rows match.

## [0.1.0] - 2016-01-11

### Changed
- **API BREAK** `extendRows` no longer calls selectors passed in arguments.
- Depreciate ``selectRow`.

### Added
- Add `selectRows`.
- Export all reducers (not only `restful`).

## 0.0.1 - 2015-12-24

### Added
- Initial commit.

[Unreleased]: https://github.com/cr0cK/bouchon-toolbox/compare/0.2.0...HEAD
[0.2.0]: https://github.com/cr0cK/bouchon-toolbox/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/cr0cK/bouchon-toolbox/compare/0.0.1...0.1.0
