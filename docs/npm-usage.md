# NPM Usage

Where possible, we try to minimise the amount of npm packages we depend on. The following table shows all dependencies we have and where they are used:

| Dependency Name                   | Purpose                                                                                 | Extra resources          |
|---                                |---                                                                                      | ---                      |
| accessible-autocomplete           | Progressive enhancement autocomplete by alphagov                                        | https://github.com/alphagov/accessible-autocomplete/ |
| govuk-frontend                    | Nunjucks library we keep parity with                                                    | https://github.com/alphagov/govuk-frontend/ |

Everything in devDependencies is for local development and testing purposes only.

| Dependency Name                   | Purpose                                                                                 | Extra resources          |
|---                                | ---                                                                                     | ---                      |
| @babel/preset-env                 | Allows us to use the latest JavaScript without needing to manage which syntax is needed | https://babeljs.io/docs/babel-preset-env |
| @rollup/plugin-babel              | Integration between rollup and babel                                                    | https://www.npmjs.com/package/@rollup/plugin-babel |
| @rollup/plugin-commonjs           | Convert CommonJS to ES6 so it can be included in a rollup bundle                        | https://www.npmjs.com/package/@rollup/plugin-commonjs |
| @rollup/plugin-node-resolve       | Locate modules in node_modules                                                          | https://www.npmjs.com/package/@rollup/plugin-node-resolve |
| adm-zip                           | JavaScript implementation for zip compression for nodejs                                | https://www.npmjs.com/package/adm-zip |
| ajv                               | JSON Validator for nodejs and browser                                                   | https://www.npmjs.com/package/ajv |
| autoprefixer                      | PostCSS plugin to apply vendor prefixes (e.g ::-{class} will generate ::-moz-class)     | https://www.npmjs.com/package/autoprefixer |
| backstopjs                        | Automate visual regression testing                                                      | https://www.npmjs.com/package/backstopjs |
| better-npm-audit                  | Provides a clearer npm audit                                                            | https://www.npmjs.com/package/better-npm-audit |
| cheerio                           | Library for parsing and manipulating HTML/XML                                           | https://cheerio.js.org/ |
| cssnano                           | CSS minification and optimisation                                                       | https://cssnano.github.io/cssnano/ |
| del                               | Deletes files and directories using globs                                               | https://www.npmjs.com/package/del |
| eslint                            | Linting tool that identifies and reports on ECMACode/JavaScript                         | https://eslint.org/ |
| eslint-config-airbnb              | Provides Airbnb's .eslintrc as an extensible shared config                              | https://www.npmjs.com/package/eslint-config-airbnb |
| eslint-plugin-import              | Supports linting of ES6+ import/export syntax                                           | https://www.npmjs.com/package/eslint-plugin-import |
| expect-puppeteer                  | Assertion library for Puppeteer                                                         | https://www.npmjs.com/package/expect-puppeteer |
| express                           | Web framework for nodejs                                                               | https://www.npmjs.com/package/express |
| glob                              | Match files using patterns used by shell                                                | https://www.npmjs.com/package/glob |
| gulp                              | Automates workflows to compose pipelines                                                | https://gulpjs.com/ |
| gulp-better-rollup                | A plugin for gulp to handle rollup                                                      | https://www.npmjs.com/package/gulp-better-rollup |
| gulp-eol                          | Replace or append end of line to end of files                                           | https://www.npmjs.com/package/gulp-eol |
| gulp-filter                       | Allows you to work with a subset of files by filtering them                             | https://www.npmjs.com/package/gulp-filter |
| gulp-plumber                      | A monkey patch plugin for fixing issues with Node Streams piping                        | https://www.npmjs.com/package/gulp-plumber |
| gulp-postcss                      | A plugin to allow piping CSS through multiple plugins but parse the CSS only once       | https://www.npmjs.com/package/gulp-postcss |
| gulp-rename                       | Allows renaming of files                                                                | https://www.npmjs.com/package/gulp-rename |
| gulp-sass                         | Allows rendering of CSS via SASS through gulp                                           | https://www.npmjs.com/package/gulp-sass |
| gulp-sourcemaps                   | Sourcemap support for gulp                                                              | https://www.npmjs.com/package/gulp-sourcemaps |
| gulp-uglify-es                    | Gulp stream for uglifying content                                                       | https://www.npmjs.com/package/gulp-uglify-es |
| husky                             | Lints commit messages, code and run tests on commit/push                                | https://typicode.github.io/husky/ |
| jest                              | JavaScript Testing Framework                                                            | https://jestjs.io/ |
| jest-axe                          | Jest matcher for axe accessibility testing                                              | https://www.npmjs.com/package/jest-axe |
| jest-environment-jsdom            | JSDom testing environment                                                               | https://jestjs.io/docs/next/configuration#testenvironment-string |
| jest-puppeteer                     | Jest preset that contains configuration for writing integration tests with Puppeteer    | https://www.npmjs.com/package/jest-puppeteer |
| jest-serializer-html               | Turns strings that start with `<` to neatly indent html                                 | https://www.npmjs.com/package/jest-serializer-html |
| js-yaml                            | An implementation of YAML                                                               | https://www.npmjs.com/package/js-yaml |
| mkdirp                             | An implementation of `mkdir -p` for nodejs                                              | https://www.npmjs.com/package/mkdirp |
| node-fetch                         | Brings the fetch api to nodejs                                                          | https://www.npmjs.com/package/node-fetch |
| node-sass                         | A library for binding nodejs to LibSass - Deprecated                                    | https://www.npmjs.com/package/node-sass |
| nodemon                           | Helps develop with nodejs by automatically restarting when file changes detected        | https://nodemon.io/ |
| nunjucks                          | Templating engine for JavaScript                                                        | https://www.npmjs.com/package/nunjucks |
| playwright-chromium               | Launch or connect to Chromium                                                           | https://playwright.dev/docs/api/class-playwright#playwright-chromium |
| playwright-core                   | No-browser variant of playwright                                                        | N/A (See playwright docs) |
| postcss                           | Transform styles with js plugins                                                        | https://postcss.org/ |
| postcss-scss                      | SCSS parser for PostCSS                                                                 | https://www.npmjs.com/package/postcss-scss |
| puppeteer                         | High-level API to control Chrome or Firefox via DevTools or WebDriver BiDi              | https://www.npmjs.com/package/puppeteer |
| recursive-readdir                 | Recursively list all files in a directory and its subdirectories                        | https://www.npmjs.com/package/recursive-readdir |
| remarkable                        | Markdown parser                                                                         | https://www.npmjs.com/package/remarkable |
| rollup                            | Module bundler for JavaScript, compiles small pieces of code into something larger      | https://rollupjs.org/ |
| sass                              | JavaScript implementation of Sass (Dart Sass)                                           | https://www.npmjs.com/package/sass |
| sinon                             | Standalone test spies, stubs and mocks for JavaScript                                   | https://sinonjs.org/ |
| standard                          | Standard style guide, linter and formatter                                              | https://standardjs.com/ |
| stylelint                         | CSS Linter                                                                              | https://stylelint.io/ |
| stylelint-config-gds              | Stylelint config as per conventions of Government Digital Service (GDS)                 | https://github.com/alphagov/stylelint-config-gds |
| yargs                             | Helps build interactive command-line tools by parsing arguments and generating UIs      | https://yargs.js.org/ |
