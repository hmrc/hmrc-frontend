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

### Adding or updating NPM dependencies

To minimise the security risk from accidentally installing a compromised package, you should:
- Use the `--ignore-scripts` parameter when installing to prevent the package from executing scripts during installation. This can't be configured automatically in the repo because it would disable our ability to run any scripts (even the top-level ones in the project)
- Run `npm run audit` post installation to check for vulnerabilities after installing before running a build or test using it

  > **Note**
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


* If you're running on a Mac with Apple Silicon (eg. M1 processor), you should uncomment the workarounds in [`backstop-config.js`](tasks/gulp/backstop-config.js)
to use a compatible version of backstop/chromium, to work around [this known issue](https://github.com/garris/BackstopJS/issues/1300).


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

#### Test for compatibility
The code you contribute must be accessible. This means it works on every browser or device your users 
may use to access it.

You can find out more about designing for different browsers and devices.

### Write documentation

#### Keep a CHANGELOG
HMRC Frontend follows the guidelines in [keepachangelog.com](http://keepachangelog.com/).

#### Write good commits
HMRC Frontend follows [the same standards as GOV.UK](https://gds-way.cloudapps.digital/).

#### Squash related commits
Squash multiple commits into one to make reviewing code easier.

#### Keep a record of decisions

We are using MADRs to record significant decisions in this service. To find out more
visit [MADR](https://github.com/adr/madr)

See our [decision log](docs/adr/index.md) for a list of past decisions.

##### How to prepare a new decision

1. Copy [template.md](docs/adr/template.md) as NNNN-title-of-decision.md, and fill
in the fields. Do not feel you have to fill in all the fields, only fill in fields
that are strictly necessary. Some decisions will merit more detail than others.

1. To re-generate the [listing page for previous decisions](docs/adr/index.md) 
   so it includes the new decision, run:

    ```shell script
    npm run docs:generate-decision-log-listing
    ```

## Create a pull request

### Links and closing issues

Search for existing issues relating to your pull request and [link them together](https://github.com/blog/957-introducing-issue-mentions).

If your pull request closes an issue follow ‘[Closing issues using keywords ](https://help.github.com/articles/closing-issues-via-commit-messages/)’.

### Versions

HMRC Frontend uses [semantic versioning](https://semver.org/). Build and release tools bump versions of the project.

## Frontend principles

### Used across the tax platform

HMRC Frontend contains code for features used on several HMRC services. Code used only in one service should not 
be in HMRC Frontend.

### Progressive enhancement

All work on GOV.UK should [use progressive enhancement](https://www.gov.uk/service-manual/technology/using-progressive-enhancement).

### Accessibility

Services on GOV.UK are for the benefit of all users. This means you must build a service that’s as inclusive as possible.

[Accessibility guidance on GOV.UK](https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction).

### WebJar publishing

In order to make the hmrc-frontend assets easy to consume in a JVM environment,
the npm `build:webjar` task builds a JVM compatible webjar. This webjar is published to HMRC's open
artefact repository by an internal automated deployment process and is a dependency of
[hmrc/play-frontend-hmrc](https://www.github.com/hmrc/play-frontend-hmrc).

When testing changes in conjunction with `play-frontend-hmrc` and consuming frontend microservices,
it's possible to publish the hmrc-frontend webjar locally as follows. You will need Java 
and [Maven](https://maven.apache.org/install.html) installed.

```shell script
npm run build:package
npm run build:webjar
npm run publish-local:webjar
```

You can then reference the webjar in the `LibDependencies.scala` file in `play-frontend-hmrc` as follows:

```sbt
"uk.gov.hmrc.webjars" % "hmrc-frontend" % "X.Y.Z"
```

You will also need to configure your `build.sbt` resolvers to look in your local Maven repository:

```sbt
resolvers += Resolver.mavenLocal
```

Further documentation on the webjar mechanism can be found:

* https://www.webjars.org/documentation
* https://www.playframework.com/documentation/2.8.x/AssetsOverview
