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

What you’re planning to do may already be in our backlog or others may already be working on it.
It may have been proposed in the past and we may have decided it is out of scope.
We may have suggestions or constraints which will affect the work you need to do.

You can:
* [create an issue](https://github.com/hmrc/assets-frontend/issues/new)
* use the #community-frontend Slack channel, which requires an HMRC slack account

## Before you create a pull request

### Run `npm install` and make sure you've updated the version number

Running the following will:
- make sure any changes to your package.json are reflected in your package-lock.json
- make sure pre-commit hooks are installed and deps needed to run their checks are available
- bump the version number in your package.json and package-lock.json
- HMRC Frontend uses [semantic versioning](https://semver.org/) - if you've made any breaking changes,
you should bump the major version, otherwise the minor version

> [!WARNING]
> Make sure you commit the changes!

```
npm install
# for breaking changes:
npm version major
# for non-breaking changes:
npm version minor
```

### Adding or updating NPM dependencies

To minimise the security risk from accidentally installing a compromised package, you should:
- Use the `--ignore-scripts` parameter when installing to prevent the package from executing scripts during installation. This can't be configured automatically in the repo because it would disable our ability to run any scripts (even the top-level ones in the project)
- Run `npm run audit` post installation to check for vulnerabilities after installing before running a build or test using it

> [!NOTE]
> Deliberately compromised packages tend to be quickly removed from NPM once they are discovered, but a removed package might be present in a cache somewhere so for safety we should always run this check.

- Carefully consider if new dependencies are really needed, and try to avoid adding them whenever possible

### Ensure there are no reference to node_modules in SCSS files

In production, styles from hmrc-frontend are imported via a webjar. If services compile their own
CSS and reference the SCSS files directly, any references to govuk-frontend modules starting with `node_modules/govuk-frontend`
will not work. Instead, you must use a relative path starting with `../../../../govuk-frontend`
 to reference these modules as shown [here](src/components/currency-input/_currency-input.scss)

### Use EditorConfig

To make sure code is consistent, HMRC Frontend uses [EditorConfig](http://editorconfig.org).

You can [install a plugin](http://editorconfig.org/#download) for your editor or manually enforce the 
rules listed in [.editorconfig](.editorconfig).

### Lint the code

hmrc-frontend follows the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript). To lint 
and autofix your code,

```shell script
npm run lint:fix
```

The above command will show you any remaining issues after the tool has fixed what it can for you.

The build server also checks the code when running the tests.

### Test your code

#### Unit tests
Run tests to make sure they pass. If the existing tests do not apply to your code, write new ones.

```shell script
npm run test
```

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

On completion, Backstop will emit the results as an HTML report in `/backstop_data/hmrc_report`.  If a failure is the
result of a known change to the component, the reference images can be updated by running,

```shell script
npm run test:backstop-approve
```

##### Troubleshooting
* If you're running on a Linux OS, you may need to configure the `BACKSTOP_TEST_HOST` environment variable for the docker container used by BackstopJS.
To do this and run the BackstopJS tests in one command, you can run the following command
    ```shell
    env BACKSTOP_TEST_HOST={your local machines ip address} npm run test:backstop 
    ```

* If backstop tests hang, you should try lowering `asyncCaptureLimit` and/or `asyncCompareLimit` in [`backstop-config.js`](tasks/gulp/backstop-config.js).
The tests will take longer to run, but might no longer hang.

* If you run into a problem where some of your visual regression tests are failing due to unrelated changes (for instance on screens you may not have touched or updated),
you may want to delete the `node_modules` folder from the root of the project and then re-run command.
    ```shell
    npm install
    ```

All examples of components will be checked by backstop. You can adjust the backstop configuration for a component or a
specific example of a component by adding options under the `visualRegressionTests` key to the yaml configuration for
the component or example.

For example to introduce a delay before a screenshot is taken for all examples of a component:

```yaml
examples:
 - name: welsh-language
   data:
    language: "cy"
    timeout: 70
    countdown: 68
    keepAliveUrl: "?abc=def"
    signOutUrl: "?ghi=jkl"

visualRegressionTests:
 backstopScenarioOptions:
  delay: 2000
```

Or just for a specific example:

```yaml
examples:
 - name: welsh-language
   data:
    language: "cy"
    timeout: 70
    countdown: 68
    keepAliveUrl: "?abc=def"
    signOutUrl: "?ghi=jkl"
   visualRegressionTests:
    backstopScenarioOptions:
     delay: 2000
```

You can also capture examples of components in different states.

For example, an input with a focused state:

```yaml
examples:
 - name: default
   description: A text input
   data:
    label:
     text: test-label
    id: input-example
    name: test-name
 - name: invalid
   description: A text input with an error
   data:
    label:
     text: test-label
    id: input-example
    name: test-name
    errorMessage: Please enter the correct value

visualRegressionTests:
 alternateStates:
  focused:
   clickSelector: .govuk-label
```

The configuration above would result in 4 backstop checks being run. One for each example: default, and invalid; and one
for each example in each alternate state - so in this case: default when focused, and invalid when focused.

Alternate states on a specific example will override any supplied at the component level:

```yaml
examples:
 - name: default
   description: A text input
   data:
    label:
     text: test-label
    id: input-example
    name: test-name
   visualRegressionTests:
    alternateStates: [ ]

visualRegressionTests:
 alternateStates:
  focused:
   clickSelector: .govuk-label
```

The configuration above would result in an alternate focused state for all examples except the default which overrides
the alternate states with an empty list.

For more general backstop configuration take a look at [tasks/gulp/backstop-config.js]()

##### Remove unused backstop reference images

If the name of a visual regression test scenario changes, the reference image won't be automatically deleted

Accumulating some unused reference images is unlikely to cause any problems

To remove them, run the tests and remove any files in bitmaps_reference that are not in the bitmaps_test folder

#### Test for compatibility
The code you contribute must be accessible. This means it works on every browser or device your users 
may use to access it.

You can find out more about designing for different browsers and devices in the
[GOVUK Service Manual](https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices).

### Make new components available in the GOVUK prototype kit
If you've added a new component, you should register its nunjucks macro in [govuk-prototype-kit.config.json](src/govuk-prototype-kit.config.json)
so that it's automatically available for users of the (v13+) GOVUK prototype kit (users of older prototype kits can still import it manually).

### Write documentation

#### Keep a CHANGELOG
HMRC Frontend follows the guidelines in [keepachangelog.com](http://keepachangelog.com/).

#### Write good commits
HMRC Frontend follows [the same standards as GOV.UK](https://gds-way.cloudapps.digital/).

#### Squash related commits
Squash multiple commits into one to make reviewing code easier.

## Create a pull request

### Links and closing issues

Search for existing issues relating to your pull request and [link them together](https://github.com/blog/957-introducing-issue-mentions).

If your pull request closes an issue follow ‘[Closing issues using keywords](https://help.github.com/articles/closing-issues-via-commit-messages/)’.

## Frontend principles

### Used across the tax platform

HMRC Frontend contains code for features used on several HMRC services. Code used only in one service should not 
be in HMRC Frontend.

### Progressive enhancement

All work on GOV.UK should [use progressive enhancement](https://www.gov.uk/service-manual/technology/using-progressive-enhancement).

### Accessibility

Services on GOV.UK are for the benefit of all users. This means you must build a service that’s as inclusive as possible.

[Accessibility guidance on GOV.UK](https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction).

## When can I expect someone to look at my external contribution?

The maintainers will get a notification that your PR has been raised, however we are a small team and you might not get 
an immediate response. If you haven't heard back within a few working days you can bump the thread with a 
comment to get our attention in case the notification was missed. We might not be able to merge the change immediately, 
depending on the size of the change, prior engagement with the team to agree and prepare for the work, other work the team 
has in progress, and external stakeholders we might need to check with.
