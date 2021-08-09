const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Remarkable = require('remarkable');

const configPaths = require('../config/paths.json');

const childDirectories = (dir) => fs.readdirSync(dir)
  .filter((file) => {
    const filePath = path.join(configPaths.components, file);
    const isDirectory = fs.statSync(filePath).isDirectory();
    const hasComponentConfig = fs.existsSync(`${filePath}/${file}.yaml`);
    return isDirectory && hasComponentConfig;
  });

// Generate component list from source directory, excluding anything that's not
// a directory (for example, .DS_Store files)
exports.allComponents = childDirectories(configPaths.components);

// Read the contents of a file from a given path
const readFileContents = (filePath) => fs.readFileSync(filePath, 'utf8');

exports.readFileContents = readFileContents;

const getComponentData = (componentName) => {
  const yamlPath = path.join(configPaths.components, componentName, `${componentName}.yaml`);
  return yaml.safeLoad(
    fs.readFileSync(yamlPath, 'utf8'), { json: true },
  );
};

exports.getComponentData = getComponentData;

const md = new Remarkable();

const govukify = (html) => html
  .replace(/<p>/g, '<p class="govuk-body">')
  .replace(/<h1/g, '<h1 class="govuk-heading-l"')
  .replace(/<h2/g, '<h2 class="govuk-heading-m"')
  .replace(/<h3/g, '<h3 class="govuk-heading-s"')
  .replace(/<ul/g, '<ul class="govuk-list govuk-list--bullet govuk-list--spaced"')
  .replace(/<a /g, '<a class="govuk-link" ');

const getComponentReadme = (componentPath) => {
  const readme = path.join(configPaths.components, componentPath, 'README.md');
  const markdown = readFileContents(readme);
  const html = md.render(markdown);
  return govukify(html);
};

exports.getComponentReadme = getComponentReadme;
