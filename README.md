# HMRC Frontend

HMRC Frontend contains the code and documentation for patterns specifically designed for HMRC.

[GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) and the [GOV.UK Design System](https://design-system.service.gov.uk/) contains the code and documentation for design patterns designed to be used by all government departments.

The two sets of code and documentation are separate but used together.

See [HMRC Design Patterns](https://design.tax.service.gov.uk/hmrc-design-patterns/) for examples of what the design patterns look like and guidance on how to use them in your service.

## Quick Start

### Requirements

* [Node.js](https://nodejs.org/en/) `>= 10.12.0`
* [npm](https://www.npmjs.com/) `>= 6.4.1`

To install more than one version of Node.js, it may be easier to use a node version manager like [nvm](https://github.com/creationix/nvm) or [n](https://github.com/tj/n).

### How to install

Clone this repository and install its dependencies.

```bash
git clone https://github.com/hmrc/hmrc-frontend.git
cd hmrc-frontend
npm install
```

### How to run

1. Run `npm start`
2. Components are available at http://localhost:3000

## Using HMRC Frontend locally

### Prototypes

`npm install hmrc-frontend`

### Frontend microservices

For use in frontend microservices running on MDTP, please refer to the [README](https://www.github.com/hmrc/play-frontend-hmrc)
 in play-frontend-hmrc.
    
## How to contribute

### Design patterns

If you need a pattern that does not appear in the HMRC Design Patterns, you can [contribute a new one](https://github.com/hmrc/design-patterns/issues/new).

### Features and issues

If you would like to propose a feature or raise an issue with HMRC Frontend, [create an issue](https://github.com/hmrc/hmrc-frontend/issues/new).

You can also create a pull request to contribute to HMRC Frontend. See our [contribution process and guidelines for HMRC Frontend](CONTRIBUTING.md) before you create a pull request.

### Code Style (Linting)

We use tools to ensure the style of our SCSS and JS is consistent.  The code is checked when the tests
run on the build server.  If you are contributing SCSS or JS you'll probably be running
the tests using `npm test` - this includes the code style checks.

To run the code style checks independently you can run `npm run lint`.

Automatic fixing is available for a number of the code style rules we apply.  To let the tool
automatically fix the issues it can fix run `npm run lint:fix` - that will show you any remaining
issues after the tool has fixed what it can for you.

### WebJar publishing

In order to make hmrc-frontend and govuk-frontend assets easy to consume in a Play framework-based environment,
the npm `build:webjar` and `build:govuk-webjar` tasks build Play compatible webjars for the NPM packages 
`hmrc-frontend` and `govuk-frontend`. These webjars are published to HMRC's open artefact repository 
by an internal automated deployment process.

The `govuk-frontend` and `hmrc-frontend` webjars are dependencies of
[hmrc/play-frontend-govuk](https://www.github.com/hmrc/play-frontend-govuk) and [hmrc/play-frontend-hmrc](https://www.github.com/hmrc/play-frontend-hmrc),
the two libraries that implement the [GOV.UK design system](https://design-system.service.gov.uk/)
and [Design resources for HMRC](https://design.tax.service.gov.uk/)
for HMRC frontend microservices.

When testing changes in conjunction with `play-frontend-hmrc` and consuming frontend microservices,
it's possible to publish the hmrc-frontend webjar locally as follows. You will need Java and [Maven](https://maven.apache.org/install.html)
installed.

```bash
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

To build and locally publish the govuk-frontend webjar:

```bash
npm run build:govuk-webjar
npm run publish-local:govuk-webjar
```

Further documentation on the webjar mechanism can be found:

* https://www.webjars.org/documentation
* https://www.playframework.com/documentation/2.8.x/AssetsOverview

## License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
