const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

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
