# NPM Usage

Where possible, we try to minimise the amount of npm packages we depend on. The following table shows all dependencies we have and where they are used:

| Dependency Name                   | Purpose                                                                                 | Extra resources          |
|---                                |---                                                                                      | ---                      |
| @babel/core                       | Modern JavaScript compiled to browser-compatible JavaScript, Polyfills                  | https://babeljs.io/
| @babel/plugin-transform-runtime   | Ensures that babel helpers doesn't repeat itself where possible                         | https://babeljs.io/docs/babel-plugin-transform-runtime |
| @babel/preset-env                 | Allows us to use the latest JavaScript without needing to manage which syntax is needed | https://babeljs.io/docs/babel-preset-env |
| babel-loader                      | Allows us to load babel with webpack                                                    | https://www.npmjs.com/package/babel-loader |
| core-js                           | Standard library for JavaScript with polyfills | https://www.npmjs.com/package/core-js |
| css-loader                        | Allows us to use modern css with webpack | https://www.npmjs.com/package/css-loader |
| dot-properties                    | Adds stringify and parse methods on properties, used in `loaders/message-format-loader` | https://www.npmjs.com/package/dot-properties |
| govuk-frontend                    | Nunjucks library we keep parity with | https://github.com/alphagov/govuk-frontend/ |
| js-cookie                         | Lightweight library for handling cookies | https://www.npmjs.com/package/js-cookie |
| playwright                        | Web testing and automation framework | https://playwright.dev/ |
| style-loader                      | Creates style nodes from JS Strings | https://www.npmjs.com/package/style-loader |
| ts-loader                         | Typescript loader for webpack | https://www.npmjs.com/package/ts-loader |
| typescript                        | Strongly typed language building on JavaScript | https://www.typescriptlang.org/ |
| webpack                           | JavaScript module bundler, also provides transforming and packaging capabilities | https://webpack.js.org/ |
| webpack-cli                       | Webpack CLI so we can use it in npm scripts | https://webpack.js.org/api/cli/ |

Everything in devDependencies is for local development and testing purposes only.

| Dependency Name                   | Purpose                                                                                 | Extra resources          |
|---                                | ---                                                                                     | ---                      |
| @babel/preset-typescript          | Allows babel to work with Typescript                                                    | https://babeljs.io/docs/babel-preset-typescript |
| @testing-library/dom              | Allows testing of the DOM                                                               | https://www.npmjs.com/package/@testing-library/dom |
| @testing-library/jest-dom         | Custom jest matchers that assert on various states of the DOM                           | https://www.npmjs.com/package/@testing-library/jest-dom |
| @types/jest                       | Type definitions for Jest                                                               | https://www.npmjs.com/package/@types/jest |
| @typescript-eslint/eslint-plugin  | Load in rules and rule configurations from typescript-eslint                            | https://typescript-eslint.io/packages/eslint-plugin |
| @typescript-eslint/parser         | Parses TypeScript into ESLint compatible nodes                                          | https://typescript-eslint.io/packages/parser/ |
| backstopjs                        | Automate visual regression testing                                                      | https://www.npmjs.com/package/backstopjs |
| better-npm-audit                  | Provides a clearer npm audit                                                            | https://www.npmjs.com/package/better-npm-audit |
| eslint                            | Linting tool that identifies and reports on ECMACode/JavaScript                         | https://eslint.org/ |
| eslint-config-airbnb              | Provides Airbnb's .eslintrc as an extensible shared config                              | https://www.npmjs.com/package/eslint-config-airbnb |
| eslint-config-airbnb-typescript   | Enhances Airbnb's ESLint config with TypeScript support                                 | https://www.npmjs.com/package/eslint-config-airbnb-typescript |
| eslint-plugin-import              | Supports linting of ES6+ import/export syntax                                           | https://www.npmjs.com/package/eslint-plugin-import |
| express                           | Web framework for node.js                                                               | https://www.npmjs.com/package/express |
| husky                             | Lints commit messages, code and run tests on commit/push                                | https://typicode.github.io/husky/ |
| identity-obj-proxy                | Allows Jest to mock an object as css modules                                            | https://www.npmjs.com/package/identity-obj-proxy |
| jest                              | JavaScript Testing Framework                                                            | https://jestjs.io/ |
| jest-environment-jsdom            | JSDom testing environment                                                               | https://jestjs.io/docs/next/configuration#testenvironment-string |
| jest-html-loader                  | html-loader for transforming with jest - OUTDATED: depends on old html-loader           | https://jestjs.io/docs/next/configuration#testenvironment-string |
| jest-jasmine2                     | Test runner for Jest                                                                    | https://jestjs.io/docs/configuration#testrunner-string |
| jsdom                             | Emulates the DOM for testing                                                            | https://www.npmjs.com/package/jsdom |
| node-sass                         | A library for binding node.js to LibSass - Deprecated                                   | https://www.npmjs.com/package/node-sass |
| playwright-chromium               | Launch or connect to Chromium                                                           | https://playwright.dev/docs/api/class-playwright#playwright-chromium |
| playwright-core                   | No-browser variant of playwright                                                        | N/A (See playwright docs) |
| sass-loader                       | Loads a sass/scss file and compiles to css                                              | https://www.npmjs.com/package/sass-loader |
| standardx                         | Allows us to follow the JavaScript Standard Style                                       | https://www.npmjs.com/package/standardx |
| stylelint                         | CSS Linter                                                                              | https://stylelint.io/ |
| stylelint-config-gds              | Stylelint config as per conventions of Government Digital Service (GDS)                 | https://github.com/alphagov/stylelint-config-gds |
| ts-jest                           | Jest transformer that lets us test projects written in TypeScript                       | https://kulshekhar.github.io/ts-jest/ |
