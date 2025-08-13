# HMRC Frontend

HMRC Frontend contains the code and documentation for patterns specifically designed for HMRC.

[GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) and the 
[GOV.UK Design System](https://design-system.service.gov.uk/) contains the code and documentation for 
design patterns designed to be used by all government departments.

The two sets of code and documentation are separate but used together.

See [HMRC Design Patterns](https://design.tax.service.gov.uk/hmrc-design-patterns/) for examples 
of what the design patterns look like and guidance on how to use them in your service.

## Quick Start

### Requirements

* [Node.js](https://nodejs.org/en/) `>= 14.18.0`
* [npm](https://www.npmjs.com/) `>= 6.14.15`

To install more than one version of Node.js, it may be easier to use a node version manager 
like [nvm](https://github.com/nvm-sh/nvm) or [n](https://github.com/tj/n).

### How to install

Clone this repository and install its dependencies.

```shell script
git clone https://github.com/hmrc/hmrc-frontend.git
cd hmrc-frontend
npm install
```

#### Overriding compatibility

Your prototype may fail locally on `npm install`, due to the version of govuk-frontend being incompatible with hmrc-frontend. If you don't want to bump that version, you can set an environment variable to be able to continue without it:

```
export HMRC_FRONTEND_DISABLE_COMPATIBILITY_CHECK=true
```

### How to run

1. Run `npm start`
2. Components are available at [http://localhost:3000]()

To see version of the page with rebrand enabled just add `?rebrand=true` at the end of url.

## Using HMRC Frontend locally

### Prototypes

`npm install hmrc-frontend`

### Frontend microservices

For use in frontend microservices running on MDTP, please refer to the [README](https://www.github.com/hmrc/play-frontend-hmrc)
 in play-frontend-hmrc.

## Explanations

### Relative `@import`s and SASS load paths

Our SASS needs to be compilable in three different contexts:

1. Within the library itself
2. Within the node_modules folder of prototypes
3. Within the folder that webjar assets get extracted to in tax services

[SASS load paths](https://sass-lang.com/documentation/at-rules/use/#load-paths) are folders that SASS will look in for
paths you try to `@import` SASS files from.

#### How will `@import "../../govuk-frontend";` be resolved in these different contexts?

##### 1. Within the library itself during release and local development

The govuk-frontend dependency will be located in the node_modules directory, so it will not exist
at `../../govuk-frontend` relative to the SASS files in the `src/` directory.

However, because we are doing the compilation ourselves, we can modify the SASS load paths - and so we
add `node_modules` folder (where govuk-frontend will be located) via the "includePaths" option of the SASS library we
use.

Then, to resolve `@import "../../govuk-frontend";`, the SASS compiler will first try to find the file
at `../../govuk-frontend` relative to the file doing the `@import`. Which won't be found, so then it will discard the
relative parts of the path and try to locate it within any of the folders in the configured SASS load paths - which in
this case will just be node_modules, and it will be found in `node_modules/govuk-frontend`.

Which means you could (though only theoretically, as you will be prevented by automated tests) have any relative path
prefix at the start of your `@imports` as long as the rest of the path is something that exists in the `node_modules`
folder.

##### 2. Within the node_modules folder of prototypes

In this case, we aren't able to add to the SASS load paths, so the relative parts at the start of our `@import` paths
matter.

So [src/all-govuk-and-hmrc.scss](src/all-govuk-and-hmrc.scss) will be installed
to `node_modules/hmrc-frontend/hmrc/all-govuk-and-hmrc.scss` and `@import`s of external dependencies from this file will
need to traverse up two levels to get to the node_modules folder, so `@import "../../govuk-frontend";` will resolve
to `node_modules/govuk-frontend`.

We have
an [automated test to ensure that we don't use an invalid relative path that would break this use case.](/tasks/gulp/__tests__/after-build-package.test.js#L140-L151)

##### 3. Within the folder that webjar assets get extracted to in tax services

The sbt-sassify plugin used by most tax services to compile SASS also has no way to add to the SASS load paths. Luckily,
the subfolder structure that assets from webjars are extracted into matches what you'd find in node_modules, so the
relative import paths that work for node_modules for prototypes will also work here (so long as you've got the
govuk-frontend webjar in your project.)

## How to contribute

### Design patterns

If you need a pattern that does not appear in the HMRC Design Patterns, you can [contribute a new one](https://github.com/hmrc/design-patterns/issues/new).

### Features and issues

If you would like to propose a feature or raise an issue with HMRC Frontend, [create an issue](https://github.com/hmrc/hmrc-frontend/issues/new).

You can also create a pull request to contribute to HMRC Frontend. See our [contribution process and guidelines for HMRC Frontend](CONTRIBUTING.md) before you create a pull request.

## License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").

