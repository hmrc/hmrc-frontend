# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [5.47.0] - 2023-09-08

### Changed

- Provides option to not display the 'Sign out' link on the timeout-dialog component

## [5.46.0] - 2023-08-10

### Changed

- Ensure that the backlink element is hidden if the referrer is empty or on a different domain

## [5.45.0] - 2023-08-09

### Changed

- Removed `accessible-autocomplete` from webjars included in `hmrc-frontend` webjar dependencies

## [5.44.0] - 2023-08-03

### Changed

- always show Account Menu nav buttons if JS is disabled

## [5.43.0] - 2023-08-01

### Changed

- Add pluginDependencies to `govuk-prototype-kit.config.json`

## [5.42.0] - 2023-08-01

### Changed

- hide JS backlink when JS is disabled

## [5.41.0] - 2023-07-17

### Changed

- Updated npm audit exclusions

## [5.40.0] - 2023-07-14

### Changed

- Updated the [govuk-frontend version to v4.7.0](https://github.com/alphagov/govuk-frontend/releases/tag/v4.7.0)

## [5.39.0] - 2023-06-28

### Changed

- Updated npm audit exclusions

## [5.38.0] - 2023-06-21

### Added
- Added new modifier class to GOV.UK Summary List for longer keys

## [5.37.0] - 2023-05-30

### Changed

- Enabling new gov.uk link styles

## [5.36.0] - 2023-06-01

### Changed

- Updated the position of the user research banner in the header component to comply with design system guidance

## [5.35.0] - 2023-05-30

### Changed

- Updated npm audit information

## [5.34.0] - 2023-05-25

### Changed

- Increasing test coverage before enabling new gov.uk link styles

## [5.33.0] - 2023-05-15

### Changed

- Version bump due to publishing issues

## [5.32.0] - 2023-05-10

### Changed

- Removed unused check and test scripts, updated dependencies

## [5.31.0] - 2023-05-02

### Changed

- Add empty alt attribute to logo IE8 fallback PNG in the HMRC `header` template

## [5.30.0] - 2023-04-24

### Changed

- Updated npm audit information

## [5.29.0] - 2023-04-24

### Changed

- Updated the [govuk-frontend version to v4.6.0](https://github.com/alphagov/govuk-frontend/releases/tag/v4.6.0)

## [5.28.0] - 2023-04-20

### Fixed

- Updated timeout-dialog to fix bug. If user timed out and the timeout redirection took longer than a second then it
  would get canceled and user would stay on page while the timeout dialog counted down into negative numbers.

## [5.27.0] - 2023-03-20

### Changed

- Updated npm audit information

## [5.26.0] - 2023-03-14

### Changed

- Integrated with GOVUK Prototype Kit v13
- Fixed Puppeteer deprecations
- Added missing hideCloseButton parameter to user-research-banner.yaml
- Bumped minor versions of some dependencies

## [5.25.0] - 2023-02-27

### Changed

- Updated the `user research banner` with new content and added ability to not show close button

## [5.24.0] - 2023-02-20

### Changed

- Updated the govuk-frontend version to v4.5.0


## [5.23.0] - 2023-02-17

### Changed

- Corrected logic of setting `textareaDescriptionText` in `character-count` component


## [5.22.0] - 2023-02-16

### Changed

- Updated the `character-count` component to delegate to the `govuk-frontend` component, which now supports custom text
allowing internationalization


## [5.21.0] - 2023-02-09

### Changed

- Updated the `header` component to localise `Menu` text and aria-hidden based on language parameter


## [5.20.0] - 2023-01-13

### Changed

- npm audit exclusions update


## [5.19.0] - 2023-01-04

### Changed

- npm dependencies update


## [5.18.0] - 2023-01-04

### Changed

- Updated the `footer` component to additionally include `govuk-!-display-none-print` for meta links


## [5.17.0] - 2023-01-03

### Changed

- Updated the `footer` component to include the `govuk-!-display-none-print` for improved accessibility

## [5.16.0] - 2022-12-20

### Changed

- Harmonise wording of new tab links

## [5.15.0] - 2022-12-19

### Changed

- Updated the govuk-frontend version to v4.4.1

## [5.14.0] - 2022-12-06

### Fixed

- fixed bug with timeout-dialog that could cause an early timeout after the first or second timeout warning was
dismissed

## [5.13.0] - 2022-11-30

### Changed

- Updated `npm` audit information

## [5.12.0] - 2022-11-29

### Changed

- Updated the govuk-frontend version to v4.4.0

## [5.11.3] - 2022-11-23

### Fixed

- fixed font ghosting issue in the accessible-autocomplete component

## [5.11.2] - 2022-10-06

### Fixed

- npm dependencies update

## [5.11.1] - 2022-10-06

### Fixed

- Stopped the accessible-autocomplete css from including the GDS Transport webfonts because we assume they will already be loaded

## [5.11.0] - 2022-09-29

### Added

- Added way to automatically enhance a select element into an [accessible-autocomplete](src/components/accessible-autocomplete) using the `data-module="hmrc-accessible-autocomplete"` data attribute, more details in the [accessible-autocomplete readme](src/components/accessible-autocomplete/README.md)

## [5.10.0] - 2022-09-26

### Added

- Add new [back-link-helper](src/components/back-link-helper) to provide a common way to make Back links mimic the browser Back button

## [5.9.0] - 2022-09-23

### Changed

- Updated `npm` audit information

## [5.8.0] - 2022-09-23

### Changed

- Added dependency on the `alphagov` package `accessible-autocomplete`
- Added `accessible-autocomplete` CSS and JS to the package and dist for the build

## [5.7.1] - 2022-09-15

### Changed

- Update report technical issue component to have an optional rel attribute based on the presence of a referrer url

## [5.7.0] - 2022-09-12

### Changed

- Update timeout dialogs examples with synchronisation

## [5.6.0] - 2022-09-07

### Changed

- Update timeout dialogs to use a BroadcastChannel to synchronise timeouts

## [5.5.0] - 2022-08-31

### Changed

- Update hmrc-header to have the hidden attribute on the show and hide button
- Updated `npm` audit information
- Updated [CONTRIBUTING.md](CONTRIBUTING.md) to document workaround for backstop.js testing on Apple Silicon

## [5.4.0] - 2022-08-17

### Changed

- Updated the govuk-frontend version to v4.3.1

## [5.3.0] - 2022-07-05

### Changed

- Updated the govuk-frontend version to v4.2.0

## [5.2.0] - 2022-05-26

### Changed

- Updated the `character-count` to match the changes made to the match version `govuk-frontend` v4.1.0

## [5.1.0] - 2022-05-22

### Changed

- Updated the govuk-frontend version to v4.1.0

## [5.0.6] - 2022-05-19

### Changed

- Updated `user-research-banner`, we've added extra visually-hidden text to the "No thanks" button to help users of
  assistive technology more easily understand the purpose of the button and what will happen when it's used.

## [5.0.5] - 2022-05-17

### Changed

- Updated `user-research-banner` to have a `<h2>` header, rather than `<div>`, following accessibility audits

## [5.0.4] - 2022-04-04

### Changed

- Updated profile link text in `account-menu` from "Your profile" to "Profile and settings" in English and Welsh

## [5.0.3] - 2022-04-04

### Added

- Fixed Welsh translation of "opens in a new tab" in new-tab-link component

## [5.0.2] - 2022-03-31

### Added

- Fixed bug with the list-with-actions component which could not handle an empty array set on the actions

## [5.0.1] - 2022-03-30

### Added

- Expanded examples for list-with-actions component to add custom css for items and actions

## [5.0.0] - 2022-03-28

### Changed

- Updated list-with-actions component to use govuk summary list under the hood

## [4.9.1] - 2022-03-25

### Changed

- Removed padding around page-heading component
  - Added ability to add headingClasses for h1 element
  - Added ability to add captionClasses subsection element

## [4.9.0] - 2022-03-25

### Changed

- hmrcAccountMenu link styles changed to improve contrast to meet accessibility requirements
- hmrcHeader link styles for language switcher changed to improve contrast to meet accessibility requirements

## [4.8.0] - 2022-03-17

### Changed

- resolving some issues reported by npm audit:
  - updated backstop (visual regression testing, so that's what's caused the slight difference in some text rendering and updated backstop screenshots)
  - update standard (linter)
  - updated node-sass
- removed extraneous underline that could appear in language select in hmrc-header

## [4.7.0] - 2022-03-15

### Changed

- Removed exemptions no longer needed for LDS from repository.yaml

## [4.6.0] - 2022-03-14

### Changed

- Updated hmrc header to allow header navigation items without links, and changed how fallback logo is reached
  (in line with govuk-frontend header)

## [4.5.0] - 2022-02-09

### Changed

- Updated the govuk-frontend version to v4.0.1

## [4.4.0] - 2022-02-03

### Fixed

- Fixed mobile dropdown behaviour of hmrc header with navigation items

## [4.3.0] - 2022-01-27

### Fixed

- Fixed formatting issue with header navigation classes having trailing space

## [4.2.0] - 2022-01-27

### Changed

- Added welsh translation to the page-heading components section subheading

## [4.1.1] - 2022-01-26

### Fixed

- Fixed colours on banner and header logo when browser is in high contrast mode

## [4.1.0] - 2022-01-25

### Changed

- Added a width constraint to the internal header
- Added the GOV.UK focus link styles to links in the internal header

### Fixed

- Removed the ID from SVG HMRC logo in the internal header to fix integration tests

## [4.0.0] - 2022-01-10

### Changed

- Updated the govuk-frontend version to v4.0.0

## [3.4.0] - 2021-12-1

### Changed

- Added optional business tax account link to account menu

## [3.3.0] - 2021-12-01

### Changed

- Updated Internal Header to use inline SVG

## [3.2.0] - 2021-11-17

### Changed

- Updated HMRC banner to use SVG logo and tweaked vertical alignment

## [3.1.1] - 2021-11-09

### Changed

- Updated dependencies based on output of npm audit where relevant

## [3.1.0] - 2021-11-08

### Changed

- Updated the govuk-frontend version to 3.14.0

## [3.0.0] - 2021-11-01

### Changed

- Account menu now has a "yourProfile" link, and we've removed the "paperless" and "personal details" links. This is to
  match the current implementation by PTA.

## [2.7.0] - 2021-10-06

### Changed

- Accessibility fixes to prevent users of some screen readers navigating outside an open timeout dialog.

## [2.6.0] - 2021-10-05

### Changed

- added `rel="noopener noreferrer"` to `report-technical-issue` to protect against reverse tabnapping

## [2.5.0] - 2021-09-23

### Changed

- added additionalBannersBlock to header component

## [2.4.0] - 2021-09-22

### Changed

- In hmrcHeader, render service name in a span rather than a link if no serviceUrl is supplied. See related
  govuk-frontend issue: https://github.com/alphagov/govuk-frontend/issues/1826

## [2.3.0] - 2021-09-03

### Added

- hmrcListWithActions component

## [2.2.2] - 2021-09-03

### Fixed

- Security vulnerabilities

## [2.2.1] - 2021-08-19

### Fixed

- Security vulnerabilities

## [2.2.0] - 2021-08-10

### Changed

- Standardised the radio button values regardless of the language

## [2.1.1] - 2021-08-05

### Changed

- Added links to examples under components on the listing page when running the local dev server

## [2.1.0] - 2021-08-04

### Changed

- Added default heading wording for timeout dialog and added heading to ariaLabelledBy

## [2.0.0] - 2021-07-12

### Changed

- Supply Javascript modules uncompiled to allow additional flexibility for bundling
  by third-party consumers.

## [1.38.0] - 2021-07-05

### Fixed

- Added Welsh translation for Internal Banner

## [1.37.1] - 2021-06-29

### Fixed

- Issue with webjar publishing due to missing md5 file

## [1.37.0] - 2021-06-29

### Changed

- Upgrade to govuk-frontend v3.13.0

## [1.36.0] - 2021-06-11

### Changed

- Build and publish a webjar for Scala libraries and microservices

## [1.35.2] - 2021-05-24

### Fixed

- Corrected add-to-a-list continue messages to Continue (consistent capitalization)

## [1.35.1] - 2021-05-19

### Changed

- Added novalidate to Add To A List in order to match the standard for forms

## [1.35.0] - 2021-05-19

### Changed

- Uplift to govuk-frontend v3.12.0

## [1.34.0] - 2021-05-05

### Changed

- URL for report-technical-issue component updated to point to new contact-frontend endpoint /contact/report-technical-problem

## [1.33.1] - 2021-05-05

### Fixed

- Security vulnerabilities

## [1.33.0] - 2021-05-05

### Fixed

- Fix timeout dialog on IE by adding polyfill for Number.isNaN

## [1.32.0] - 2021-04-29

### Fixed

- Allowing the initialization of multiple character counts on a single page when using `initAll`

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

[Unreleased]: https://github.com/hmrc/hmrc-frontend/compare/v0.5.0...main
[0.5.0]: https://github.com/hmrc/hmrc-frontend/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/hmrc/hmrc-frontend/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/hmrc/hmrc-frontend/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/hmrc/hmrc-frontend/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/hmrc/hmrc-frontend/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/hmrc/hmrc-frontend/releases/tag/v0.1.0
