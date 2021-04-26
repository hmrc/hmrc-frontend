# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## 1.31.0 - 2021-04-27

### Fixed

- Accessibility issue with hmrcAddToAList (
  see [comment from Adam Liptrot on github issue 31 describing problem and solution](https://github.com/hmrc/design-patterns/issues/31#issuecomment-799628620))
  . Previously JAWS list items dialog would announce action labels as well as the item identifier when describing a list
  item. Following this change only the actual identifier for the row will be announced.

## [1.30.1] - 2021-04-27

### Fixed

- Increased visual regression testing coverage to include all component examples

## [1.30.0] - 2021-03-25

### Added

- Timeline component

## [1.29.0] - 2021-03-24

### Fixed

- Added a class to Report Technical Issue to help with browser testing

## [1.28.0] - 2021-03-19

### Fixed

- Package was missing LICENSE

## [1.27.0] - 2021-03-04

### Added

- HMRC character count

## [1.26.2] - 2021-02-25

### Fixed

- User research banner Welsh example missed url field

## [1.26.1] - 2021-02-23

### Fixed

- Issue with node_modules reference in the hmrcUserResearchBanner,
causing problems in frontend microservices using the hmrc-frontend webjar.

## [1.26.0] - 2021-02-19

### Added

- HMRC user research banner

## [1.25.0] - 2021-02-17

### Updated

- Update govuk-frontend to v3.11.0

## [1.24.0] - 2021-02-08

### Added

- Compiled assets now included in NPM package.
- Refactored gulp pipeline

## [1.23.1] - 2020-12-11

### Security

- Bumped ini to v1.3.5

## [1.23.0] - 2020-12-09

### Changed

- serviceId added for configuring contact-frontend for consistency with
contact-frontend documentation, serviceCode deprecated

### Fixed

- Fixed colour contrast for focused sign out link in gov.uk header not meeting accessibility standards

## [1.22.0] - 2020-12-02

### Fixed

- Accessibility issue with hmrcHeader when displayHmrcBanner set to true. Previously this
component defined two top-level 'banner' landmarks failing accessibility tests. On advice from the
HMRC accessibility team, the HMRC banner has been moved inside HEADER so that screen-reader users read the
banner as part of the overall header and can skip to the main content more easily.

## [1.21.0] - 2020-11-23

### Changed

- Content for report a technical problem link to be consistent with contact-frontend

## [1.20.0] - 2020-11-12

### Updated

- Added `baseUrl` to `hmrcReportTechnicalIssue` to allow it to work in pre-live environments.
- Added `referrerUrl` to `hmrcReportTechnicalIssue` to enable services to pass through the page on which the user encountered the problem.

## [1.19.1] - 2020-11-06

### Updated

- Using the latest version of `govuk-frontend`.
- Upgrading to the latest version of `backstopjs`, trying and failing to avoid a vulnerability but still worth upgrading.

## [1.19.0] - 2020-10-16

### Fixed

- Added clone of GDS footer with Welsh language translations

## [1.18.0] - 2020-10-16

### Fixed

- issue where status tags weren't left aligning at mobile widths
- issue where iPadOS 13.6+ caused issues with currency input
- issue where empty div was created when displayHmrcBanner is false
- incorrectly added aria-hidden attribute on 'Your Account' link in PTA account menu
- issue where horizontal scrollbars were appearing on the internal header in certain browsers

## [1.17.0] - 2020-09-21

### Changed

- `hmrcNewTabLink` Text updated to match GDS recommendation (English only)

## [1.16.0] - 2020-09-10

### Changed

- `hmrcTimeoutDialog` Allow users to set a different URL for timeouts than manual sign outs

## [1.15.3] - 2020-08-14

### Fixed

- issue where internal header where font wasn't being set

## [1.15.1] - 2020-07-13

- Added the messageSuffix parameter to the timeout Nunjucks component

## [1.15.0] - 2020-07-03

### Fixed

- Added an audible countdown to the timeout dialog for screenreader users
- Added language parameter to the hmrcTimeoutDialog component to allow welsh language versions to be supported

## [1.14.1] - 2020-06-30

### Fixed

- Security vulnerabilities in dev dependencies

## [1.14.0] - 2020-06-19

### Fixed

- Updated implementation of hmrcHeader to be consistent with govuk-frontend v3.7.0 (an empty navigation
array now treated as the same as navigation not being specified at all)

### Compatible with

- [alphagov/govuk-frontend v3.7.0](https://github.com/alphagov/govuk-frontend/releases/tag/v3.7.0)

## [1.13.0] - 2020-05-14

### Fixed

- Add to list pattern having same values for yes and no radio inputs
- Add to list pattern capitalisation for radio inputs changed to 'Yes', 'No' from 'yes', 'no'

### Compatible with

- [alphagov/govuk-frontend v3.6.0](https://github.com/alphagov/govuk-frontend/releases/tag/v3.6.0)

## [1.12.0] - 2020-05-01

### Added

- Upgrade govuk-frontend to v3.6.0
- Visual regression testing

### Fixed

- Fix static asset bundling issue

## [1.11.0] - 2020-04-22

### Fixed

- The way Sass assets from govuk-frontend are imported to allow use in Scala front-ends
- Removed compatibility check for now due to issues with versions of the form X.Y0.Z

## [1.10.1] - 2020-04-22

### Fixed
- Fix compatibility check - this is a temporary workaround to avoid throwing an exception with the version can't be found.

## [1.10.0] - 2020-04-21

### Added

- Report technical issue component

## [1.9.1] - 2020-04-21

### Fixed
- Fix incorrect nesting of language selector styles

## [1.9.0] - 2020-04-08

### Added
- `hmrcCurrencyInput` added [861d830](861d830b3c22d7bce7fe03b827c41288d66f148b)

## [1.8.1] - 2020-04-07

### Fixed
- check-compatibility.js for 1.8.0 release and recent versions of prototype kit

## [1.8.0] - 2020-04-02

### Changed
- Language toggle to a more accessible version [925f85a](925f85aeff3938e9ec06f9a325e8274b2283f53a)

## [1.7.0] - 2019-12-31

### Fixed
- Broken support for manual updates [3d2b90a](3d2b90a601c63b093b5c1a1a476350659e12adbd)

### Updated
- Vulnerable dependencies [e9ed4e1](e9ed4e19eb228e1083ec42f9f3117aee608b538c)
- govuk-frontend [2cbf3d0](2cbf3d0e3d27905098760d69497395976a0ac3b0)

## [1.6.0] - 2019-12-13

### Changed
- Version check [023c85a](023c85a2f866980981bc404f2701764ec41c6a8a)
  - Refactored check to flag only fully compatible versions as compatible
  - Change green text colour to red
  - Hide ability to install anyway behind environment flag

### Added
- Support for versions that are compatible with manual steps [c941cd4](c941cd4c4422aa2ea2a2aebbfe29c19cf613504c)
- Support for future versions [85aa22f](85aa22ffd641d48065c2bfd835120e204a43fdaf)
- Suite of unit tests for compatibility checking [aecdcbd](aecdcbdfad08c27b23429581e6708ec8f25db34b)

## [1.5.0] - 2019-11-18

### Added
- Version compatibility checking [5de91cd](5de91cd5037c601231773fecaab333651c3441eb)

## [1.4.0] - 2019-11-14

### Added
- Styles for status tags in task lists pattern [c9dc268](c9dc2689cc090f6aae806112c8815135963ca9b8)

### Changed
- `childDirectories` file helper to only return component directories containing yaml files [c9dc268](c9dc2689cc090f6aae806112c8815135963ca9b8)

## [1.3.0] - 2019-10-15

### Updated
- `govuk-frontend` dependency [02763cd](02763cdee6d3757c96626542c1e176c63b619875)

## [1.2.0] - 2019-09-11

### Updated
- `govuk-frontend` dependency [f276376](f27637633208e7b0fc970397dfad3aa1472c2d65)

## [1.1.0] - 2019-09-11

### Fixed
- ES6 syntax breaking build [55a049e](55a049e9bd34ac767891bb92e7b2d4c9c49c9856)
- Line break bug at certain resolutions [26bbe43](26bbe432bb0c98d599fa43e62f5c3a748a5d8f6e)

### Updated
- `govuk-frontend` dependency [06fe087](06fe0877883325be9fb1f073b74a17d01b26a80e)
- AXE core and fixed resulting accessibility issues [fb92b11](fb92b11aa20906b0d440bba2954404836426d831)

### Added
- Welsh translations for Account Header [f5b1ae2](f5b1ae25a4a84a98a50ed1be9c0ed08c93b258a1)

### Changed
- Switched positions of `hmrcAccountMenu` macro and `{% block beforeContent %}` to allow use of GOV.uk backlink  [6842a82](6842a822c9e53f0490b337282c2922ed98531f39)

- Removed 40px height adjustment which was causing weird layout issues [bcb6dca](bcb6dcaf946e66a24e1dcd63b543c64b51d6bc78)

## [1.0.4] - 2019-08-21

### Changed
- Only JS reset account menu when crossing a breakpoint [0ca3224](0ca322424416cab8f01969aca0eb05b22f7358d8)

## [1.0.3] - 2019-08-19

### Changed
- Switched color of language toggle selected link state to accessible value [0a1c1ce](0a1c1cebac6f0d38dec6c1b70bc648c5a5f0d196)

## [1.0.2] - 2019-08-08

### Fixed
- Fixed some broken govuk macro paths [ee8405b](ee8405b7690dcb74060065f091dcf35ee52d67fc)

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
