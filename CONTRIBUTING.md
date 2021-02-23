# Contribution guidelines

Follow these guidelines to help make sure your contribution is accepted.

## Help improve HMRC Frontend

You can help with:

* bug fixes and improvements
* new features
* more tests and better coverage
* documentation

## Get in touch

Consider getting in touch before starting a significant piece of work.

What you’re planning to do may already be in our backlog or others may already be working on it. It may have been proposed in the past and we may have decided it is out of scope. We may have suggestions or constraints which will affect the work you need to do.

You can:
* [create an issue](https://github.com/hmrc/assets-frontend/issues/new)
* use the #community-frontend Slack channel, which requires an HMRC slack account

## Before you create a pull request

### Ensure there are no reference to node_modules in SCSS files

In production, styles from hmrc-frontend are imported via a webjar. If services compile their own
CSS and reference the SCSS files directly, any references to govuk-frontend modules starting with `node_modules/govuk-frontend`
will not work. Instead, you must use a relative path starting with `../../../../govuk-frontend`
 to reference these modules as shown [here](src/components/currency-input/_currency-input.scss)

### Use EditorConfig

To make sure code is consistent, HMRC Frontend uses [EditorConfig](http://editorconfig.org).

You can [install a plugin](http://editorconfig.org/#download) for your editor or manually enforce the rules listed in [.editorconfig](https://github.com/hmrc/hmrc-frontend/blob/master/.editorconfig).

### Lint the code

HMRC Frontend follows the [JavaScript Standard Style](http://standardjs.com).

### Test your code

#### Unit tests
Run tests to make sure they pass. If the existing tests do not apply to your code, write new ones.

#### Visual regression tests
We are using [backstopJS](https://github.com/garris/BackstopJS) to perform visual regression testing. This renders 
each page of the app in a headless Chrome browser and compares against known references. The reference images
are stored in backstop_data/bitmaps_reference.

To run the tests locally, you will need [Docker Desktop](https://www.docker.com/products/docker-desktop). 
This is because there are subtle differences in rendering between platforms and we want the results to be 
consistent with CI. To run the tests,

```shell script
npm run test:backstop
```

On completion, Backstop will emit the results as an HTML report in backstop_data/hmrc_report  If a failure is the
result of a known change to the component, the reference images can be updated by running,

```shell script
npm run test:backstop-approve
```

If any changes are needed to the backstop configuration, for example to test on different device types or add to the
 list of scenarios, these can be made by editing the file `tasks/gulp/backstop-config.js`

#### Test for compatibility
The code you contribute must be accessible. This means it works on every browser or device your users may use to access it.

You can find out more about designing for different browsers and devices.

### Write documentation

#### Keep a CHANGELOG
HMRC Frontend follows the guidelines in [keepachangelog.com](http://keepachangelog.com/).

#### Write good commits
HMRC Frontend follows [the same standards as GOV.UK](https://github.com/alphagov/styleguides/blob/master/git.md).

#### Squash related commits
Squash multiple commits into one to make reviewing code easier.

## Create a pull request

### Use the template

Follow the steps in the [pull request template](https://github.com/hmrc/assets-frontend/blob/master/.github/PULL_REQUEST_TEMPLATE.md).

### Links and closing issues

Search for existing issues relating to your pull request and [link them together](https://github.com/blog/957-introducing-issue-mentions).

If your pull request closes an issue follow ‘[Closing issues using keywords ](https://help.github.com/articles/closing-issues-via-commit-messages/)’.

### Versions

HMRC Frontend uses [semantic versioning](https://semver.org/). Build and release tools bump versions of the project.

### Releases

The contributor and the Service Design Tools team together:

* decide the best time to do pre-production and production releases
* validate the impact once the release reaches pre-production and production

The Service Design Tools team will deploy or schedule the release into the relevant pre-production and production environments.

## Frontend principles

### Used across the tax platform

HMRC Frontend contains code for features used on several HMRC services. Code used only in one service should not be in HMRC Frontend.

### Progressive enhancement

All work on GOV.UK should [use progressive enhancement](https://www.gov.uk/service-manual/technology/using-progressive-enhancement).

### Accessibility

Services on GOV.UK are for the benefit of all users. This means you must build a service that’s as inclusive as possible.

[Accessibility guidance on GOV.UK](https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction).
