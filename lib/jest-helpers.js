const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');
const cheerio = require('cheerio');
const yaml = require('js-yaml');
require('jest-axe/extend-expect');

const configPaths = require('../config/paths.json');
const { componentNameToMacroName } = require('./helper-functions');

nunjucks.configure(
  [
    configPaths.components,
    path.join(configPaths.govukFrontend, 'dist'),
    path.join(configPaths.govukFrontend, 'dist/govuk/components'),
  ],
  { trimBlocks: true, lstripBlocks: true },
);

/**
 * Render a component's macro for testing
 * @param {string} componentName
 * @param {string} params parameters that are used in the component macro
 * @param {any} children any child components or text, pass the children to the macro
 * @returns {function} returns cheerio (jQuery) instance of the macro for easy DOM querying
 */
function render(componentName, params, children = false) {
  if (typeof params === 'undefined') {
    throw new Error('Parameters passed to `render` should be an object but are undefined');
  }

  const macroName = componentNameToMacroName(componentName);
  const macroParams = JSON.stringify(params, null, 2);

  let macroString = `{%- from "${componentName}/macro.njk" import ${macroName} -%}`;

  // If we're nesting child components or text, pass the children to the macro
  // using the 'caller' Nunjucks feature
  if (children) {
    macroString += `{%- call ${macroName}(${macroParams}) -%}${children}{%- endcall -%}`;
  } else {
    macroString += `{{- ${macroName}(${macroParams}) -}}`;
  }

  const output = nunjucks.renderString(macroString);

  return cheerio.load(output);
}

/**
 * Get examples from a component's metadata file
 * @param {string} componentName
 * @returns {object} returns object that includes all examples at once
 */
function getExamples(componentName) {
  const file = fs.readFileSync(
    path.join(configPaths.components, componentName, `${componentName}.yaml`),
    'utf8',
  );

  const docs = yaml.safeLoad(file);

  const examples = {};

  docs.examples.forEach((example) => {
    examples[example.name] = example.data;
  });

  return examples;
}

/**
 * Get the raw HTML representation of a component, and remove any other
 * child elements that do not match the component.
 * Relies on B.E.M naming ensuring that child components relating to a component
 * are namespaced.
 * @param {function} $ requires an instance of cheerio (jQuery) that includes the
 * rendered component.
 * @param {string} className the top level class 'Block' in B.E.M terminology
 * @returns {string} returns HTML
 */
function htmlWithClassName($, className) {
  const $component = $(className);
  const classSelector = className.replace('.', '');
  // Remove all other elements that do not match this component
  $component.find(`[class]:not([class^=${classSelector}])`).remove();
  return $.html($component);
}

module.exports = { render, getExamples, htmlWithClassName };
