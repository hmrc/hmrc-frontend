/* eslint-env jest */
const glob = require('glob');
const path = require('path');

const excludedComponents = ['sca-account-menu'];

const definedComponents = glob.sync('src/components/**/macro.njk')
  .map((filename) => path.basename(path.dirname(filename)))
  .filter((filename) => !(excludedComponents.includes(filename)));

const configuredComponents = require('./govuk-prototype-kit.config.json')
  .nunjucksMacros
  .map((macroDefinition) => macroDefinition.importFrom)
  .map((filename) => path.basename(path.dirname(filename)));

describe('govuk-prototype-kit config', () => {
  it('should configure all HMRC components for use with v13+ GOVUK prototype kit', () => {
    expect(configuredComponents).toEqual(definedComponents.reverse());
  });
});
