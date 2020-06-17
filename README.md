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

We offer a few ways of incorporating the GOV UK and HMRC CSS and JS libraries into your service. Pick the one which best suits your service. In the following instructions, `1.X.X` and `3.X.X` refers to the version of the library you require.

### 1. CDN
If you are just using the GOVUK Frontend and HMRC Frontend and are not going to be adding any service-specific CSS or JS we suggest you use the HMRC CDN version of the assets.
You will need to link to these in your service’s page template.

1. add CDN js links to your `@bodyEnd` block in the layout template
    - `<script type="text/javascript" src="https://www.tax.service.gov.uk/assets/hmrc-frontend/1.X.X/hmrc-frontend-1.X.X.min.js"></script>`
2. add CDN css links to your `@headTag` block in the layout template
    - `<link rel="stylesheet" type="text/css" href="https://www.tax.service.gov.uk/assets/hmrc-frontend/1.X.X/hmrc-frontend-1.X.X.min.css">`
    - `<link rel="stylesheet" type="text/css" href="https://www.tax.service.gov.uk/assets/hmrc-frontend/1.X.X/hmrc-frontend-ie8-1.X.X.min.css">`
`

### 2. Webjar
If you are adding some custom CSS to your service we suggest you use a webjar to pull in the GOV UK and HMRC Frontend libraries.
This will enable you to use the appropriate SASS mixins to ensure your custom code is consistent with other components. 
It will allow you to package your code along with the libraries into a single download for the user. 
It will also mean you can optionally just consume the parts of the libraries you actually need for your service.

1. add `"org.webjars.npm" % "govuk-frontend" % "3.X.X"` to your app dependencies (`hmrc-frontend` has a dependency on `govuk-frontend`)
2. add `"org.webjars.npm" % "hmrc-frontend" % "1.X.X"` to your app dependencies
3. in `application.scss`: 
    - add `$hmrc-assets-path: "/url-of-your-service/assets/lib/hmrc-frontend/hmrc/";`
    - to import all components, add `@import "lib/hmrc-frontend/hmrc/all";`
    - to import individual components, add
        - `@import "lib/hmrc-frontend/hmrc/components/header/header";` 
        - `@import "lib/hmrc-frontend/hmrc/components/account-menu/account-menu";`
        - `and so on`
    - to add to or override SASS, update `application.scss` or create additional `.scss` files and import them as described above
4. in `application.js`:
    - to add to or override javascript, update `application.js` or create additional `.js` files and add them to `build.sbt`
    
## How to contribute

### Design patterns

If you need a pattern that does not appear in the HMRC Design Patterns, you can [contribute a new one](https://github.com/hmrc/design-patterns/issues/new).

### Features and issues

If you would like to propose a feature or raise an issue with HMRC Frontend, [create an issue](https://github.com/hmrc/hmrc-frontend/issues/new).

You can also create a pull request to contribute to HMRC Frontend. See our [contribution process and guidelines for HMRC Frontend](CONTRIBUTING.md) before you create a pull request.

## License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
