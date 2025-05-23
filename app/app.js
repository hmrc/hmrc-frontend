const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');
const helperFunctions = require('../lib/helper-functions');
const fileHelper = require('../lib/file-helper');
const configPaths = require('../config/paths.json');
const pkg = require('../package.json');

const app = express();

// Set up views
const appViews = [
  configPaths.layouts,
  configPaths.views,
  configPaths.components,
  configPaths.src,
  path.join(configPaths.src, 'layouts'),
  path.join(configPaths.govukFrontend, 'dist'),
];

module.exports = (options) => {
  const nunjucksOptions = options ? options.nunjucks : {};

  // Configure nunjucks
  const env = nunjucks.configure(appViews, {
    autoescape: true, // output with dangerous characters are escaped automatically
    express: app, // the express app that nunjucks should install to
    noCache: true, // never use a cache and recompile templates each time
    trimBlocks: true, // automatically remove trailing newlines from a block/tag
    lstripBlocks: true, // automatically remove leading whitespace from a block/tag
    watch: true, // reload templates when they're changed. needs chokidar dependency to be installed
    ...nunjucksOptions, // merge any additional options and overwrite defaults above.
  });

  // Get the list of examples for a component from within a template
  env.addFilter(
    'componentExamples',
    (component) => fileHelper.getComponentData(component).examples.map(
      (example) => example.name.replace(/ /g, '-'),
    ),
  );

  // Set view engine
  app.set('view engine', 'njk');

  const govukFonts = fs.readdirSync(path.join(configPaths.govukFrontend, 'dist', 'govuk', 'assets', 'fonts'));

  app.use((req, res, next) => {
    env.addGlobal('govukRebrand', req.query?.rebrand === 'true');
    // Disallow search index indexing
    // none - Equivalent to noindex, nofollow
    // noindex - Do not show this page in search results and do not show a
    //   "Cached" link in search results.
    // nofollow - Do not follow the links on this page
    res.setHeader('X-Robots-Tag', 'none');
    // Preload fonts to make VRT test more reliable
    res.locals.govukFonts = govukFonts;
    next();
  });

  app.use('/govuk-frontend', express.static(configPaths.govukFrontend));

  app.use(
    '/assets',
    express.static(path.join(configPaths.dist)),
    express.static(path.join(configPaths.dist, 'govuk')),
  );

  // Define routes

  // Index page - render the component list template
  (() => {
    const components = fileHelper.allComponents;

    app.get('/', (req, res) => {
      res.render('index', {
        componentsDirectory: components,
        hmrcFrontendVersion: pkg.version,
      });
    });
  })();

  // Whenever the route includes a :component parameter, read the component data
  // from its YAML file
  app.param('component', (req, res, next, componentName) => {
    res.locals.componentData = fileHelper.getComponentData(componentName);
    next();
  });

  // Component 'README' page
  app.get('/components/:component([a-zA-Z-]+)', (req, res) => {
    res.render('component', {
      hmrcFrontendVersion: pkg.version,
      componentReadme: fileHelper.getComponentReadme(req.params.component),
    });
  });

  // Component example preview
  app.get('/components/:component/:example*?/preview', (req, res, next) => {
    // Find the data for the specified example (or the default example)
    const componentName = req.params.component;
    const requestedExampleName = req.params.example || 'default';

    const previewLayout = res.locals.componentData.previewLayout || 'layout';
    const type = res.locals.componentData.type || 'component';

    const exampleConfig = res.locals.componentData.examples.find(
      (example) => example.name.replace(/ /g, '-') === requestedExampleName,
    );

    const globalData = (type === 'layout' && exampleConfig.data) || {};

    if (!exampleConfig) {
      return next();
    }

    // Construct and evaluate the component with the data for this example
    const macroName = helperFunctions.componentNameToMacroName(componentName);

    const macroParameters = JSON.stringify(exampleConfig.data, null, '\t');
    const componentDirectory = helperFunctions.componentNameToComponentDirectory(componentName);

    try {
      res.locals.componentView = env.renderString(
        `
{% from '${componentDirectory}/macro.njk' import ${macroName} %}
{{ ${macroName}(${macroParameters}) }}`,
      );
    } catch (err) {
      res.locals.componentView = null;
    }

    let bodyClasses = '';
    if (req.query.iframe) {
      bodyClasses = 'app-iframe-in-component-preview';
    }

    return res.render(`${type}-preview`, {
      ...globalData, bodyClasses, previewLayout, hmrcFrontendVersion: pkg.version,
    });
  });

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
  });

  return app;
};
