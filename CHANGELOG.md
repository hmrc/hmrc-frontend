# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.0.1] - 2019-08-08

### Fixed
- Bumped patch version due to failed previous release [a653a0d](a653a0d81a2200eb776624469634cca25b8f8573)

## [1.0.0] - 2019-08-06

### Changed
- Changed directory structure and naming to remove `hmrc-` prefix as this is now provided by the namespacing [5eeee1b](5eeee1b8e510b4c33c74e05bdb5d31073131402c)
- Updated tests to accomodate new namespacing [f71673a](f71673a6d93352e07253a9d33a29edbc842da0a8)
- Namespaced package with 'hmrc' prefix to match pattern set by govuk [ef53a84](ef53a8473972f2fda4e256f8e76f407fbe30d761)

### Fixed
- Wrapped auto template generation in a try / catch to mitigate issue caused by Nunjucks version bump [ac846a0](ac846a01ebb6f8fb356381a52d00310f62fe635b)

### Updated
- `npm audit` to fix dependency issues [3c7c4c2](3c7c4c25f35dc3792c5ce72d5d92a8c0d41a8663)
- Updated `govuk-frontend` to v3.0.0 and implemented neccessary fixes [8ef9234](8ef9234739959857990355e96b77eb3e39138fbe)

## [0.6.0] - 2019-05-13

### Added
- `hmrcBanner` added [#39](https://github.com/hmrc/hmrc-frontend/pull/39)

## [0.5.0] - 2019-04-26

### Added
- `hmrcTimeoutDialog` added [#37](https://github.com/hmrc/hmrc-frontend/pull/37)

## [0.4.0] - 2019-04-18 

### Fixed
- Enable `focusHighlight` on the "Your Account" link inside Account Menu [#38](https://github.com/hmrc/hmrc-frontend/pull/38)

## [0.3.1] - 2019-03-25

### Fixed

- Fix mobile add-to-a-list [#36](https://github.com/hmrc/hmrc-frontend/pull/36)

## [0.3.0] - 2019-03-25 

### Added

- Added `add-to-a-list` [#39](https://github.com/hmrc/hmrc-frontend/pull/39)

## [0.2.0] - 2019-03-18

### Added
- `govuk-frontend` as a dependency [06c7bbe](https://github.com/hmrc/hmrc-frontend/commit/06c7bbeda9d29f59ecf9295af14c49e0e0c4456a)
- Notification badge component [d79c720](https://github.com/hmrc/hmrc-frontend/commit/d79c7202b87471a41ea7f3b2af307be7273f4f7f)
- New tab link component [#7](https://github.com/hmrc/hmrc-frontend/pull/7)
- Account menu component [#1](https://github.com/hmrc/hmrc-frontend/pull/1) [#5](https://github.com/hmrc/hmrc-frontend/pull/5) [#12](https://github.com/hmrc/hmrc-frontend/pull/12) [#18](https://github.com/hmrc/hmrc-frontend/pull/18) [#21](https://github.com/hmrc/hmrc-frontend/pull/21) [#24](https://github.com/hmrc/hmrc-frontend/pull/24) [#32](https://github.com/hmrc/hmrc-frontend/pull/32)
- Account header component [#11](https://github.com/hmrc/hmrc-frontend/pull/11) [#18](https://github.com/hmrc/hmrc-frontend/pull/18) [#19](https://github.com/hmrc/hmrc-frontend/pull/19) [#20](https://github.com/hmrc/hmrc-frontend/pull/20) [#22](https://github.com/hmrc/hmrc-frontend/pull/22)
- HMRC header component [#15](https://github.com/hmrc/hmrc-frontend/pull/15) [#18](https://github.com/hmrc/hmrc-frontend/pull/18)
- Page heading component [#13](https://github.com/hmrc/hmrc-frontend/pull/13)
- Language toggle component [#28](https://github.com/hmrc/hmrc-frontend/pull/28)
- Internal header component [#30](https://github.com/hmrc/hmrc-frontend/pull/30) [#31](https://github.com/hmrc/hmrc-frontend/pull/31)

### Changed
- Adopt a more modular JS pattern [#17](https://github.com/hmrc/hmrc-frontend/pull/17)

## [0.1.0] - 2018-07-18

This is a bootstrap release created for our CI pipeline to start building from.
Nothing meaningful was released.

[Unreleased]: https://github.com/hmrc/hmrc-frontend/compare/v0.5.0...master
[0.5.0]: https://github.com/hmrc/hmrc-frontend/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/hmrc/hmrc-frontend/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/hmrc/hmrc-frontend/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/hmrc/hmrc-frontend/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/hmrc/hmrc-frontend/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/hmrc/hmrc-frontend/releases/tag/v0.1.0
